pub mod db;

use mysql::prelude::Queryable;
use mysql::*;
use serde::Deserialize;
use tokio;
use warp::{reject::custom, reply::json, Filter, Rejection};

#[derive(Debug)]
struct DatabaseError(mysql::Error);

impl warp::reject::Reject for DatabaseError {}

pub struct NodeRequest {
    pub node_pid: i32,
}

#[tokio::main]
async fn main() -> Result<()> {
    let conn = db::connect_db()?;

    let cors = warp::cors()
        .allow_origin("http://localhost:3000")
        .allow_methods(vec!["GET", "POST", "DELETE"])
        .allow_headers(vec!["Content-Type"]);

    let get_nodes = warp::path!("api" / "nodes")
        .and(warp::get())
        .and(with_db_pool(conn.clone()))
        .and_then(|conn: Pool| async move {
            let nodes_res = db::get_nodes(&conn);

            match nodes_res {
                Ok(nodes) => {
                    let nodes_json = nodes
                        .iter()
                        .map(|node| {
                            format!("{{\"node_pid\":{},\"id\":{}}}", node.node_pid, node.id)
                        })
                        .collect::<Vec<String>>()
                        .join(",");
                    Ok::<_, warp::Rejection>(warp::reply::json(&format!("[{}]", nodes_json)))
                }
                Err(err) => {
                    eprintln!("Error querying database: {:?}", err);
                    Ok::<_, warp::Rejection>(warp::reply::json(&format!("[]")))
                }
            }
        });

    let create_node = warp::path!("api" / "nodes")
        .and(warp::post())
        .and(warp::body::json())
        .and(with_db_pool(conn.clone()))
        .and_then(|parent_id: ParentId, db_pool: Pool| async move {
            match db_pool.get_conn() {
                Ok(mut conn) => {
                    let binding = "SELECT * from nodes where id = ".to_owned()
                        + &parent_id.parent_id.to_string();
                    let query = binding.as_str();
                    let parent = conn.query_map(query, |(node_pid, id)| db::Node { node_pid, id });
                    match parent {
                        Ok(result) => {
                            let count: usize = result.len();
                            if count > 0 {
                                println!("Found parent with {} id", parent_id.parent_id);
                            } else {
                                panic!("There's no items with {} id", parent_id.parent_id);
                            }
                        }
                        Err(err) => {
                            eprintln!("Error querying database: {:?}", err);
                            std::process::exit(1);
                        }
                    }
                    let new_node_id = conn
                        .exec_drop(
                            &format!(
                                "INSERT INTO nodes (node_pid) VALUES ({})",
                                parent_id.parent_id
                            ),
                            (),
                        )
                        .map(|_| conn.last_insert_id());

                    match new_node_id {
                        Ok(id) => Ok::<_, Rejection>(json(&id)),
                        Err(err) => {
                            let database_error = DatabaseError(err);
                            Err(custom(database_error))
                        }
                    }
                }
                Err(mysql_error) => {
                    let database_error = DatabaseError(mysql_error);
                    Err(custom(database_error))
                }
            }
        });

    let routes = get_nodes.or(create_node).with(cors);
    warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;
    Ok(())
}

fn with_db_pool(
    db_pool: Pool,
) -> impl Filter<Extract = (Pool,), Error = std::convert::Infallible> + Clone {
    warp::any().map(move || db_pool.clone())
}

#[derive(Debug, Deserialize)]
struct ParentId {
    parent_id: i32,
}
