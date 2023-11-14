use mysql::prelude::*;
use mysql::*;

#[derive(Debug, PartialEq, Eq, Clone)]
pub struct Node {
    pub node_pid: i32,
    pub id: i32,
}

pub fn connect_db() -> Result<Pool> {
    let url = "mysql://root:123@localhost/test";
    let pool = Pool::new(url)?;
    return Ok(pool);
}

pub fn get_nodes(pool: &Pool) -> Result<Vec<Node>> {
    let mut conn = pool.get_conn()?;
    let query = "SELECT node_pid, id from nodes";
    let nodes = conn.query_map(query, |(node_pid, id)| Node { node_pid, id })?;
    return Ok(nodes);
}

pub fn get_node_by_id(pool: &Pool, node_id: i32) -> Result<Node> {
    let mut conn = pool.get_conn()?;
    let binding = "SELECT * from nodes where id = ".to_owned() + &node_id.to_string();
    let query = binding.as_str();
    let nodes = conn.query_map(query, |(node_pid, id)| Node { node_pid, id })?;
    let node = nodes.first().cloned().unwrap();

    return Ok(node);
}

pub fn create_node(pool: &Pool, node_pid: i32) -> Result<i32, Error> {
    let mut conn: PooledConn = pool.get_conn()?;
    let query = r"INSERT INTO nodes (node_pid) VALUES (:node_pid)";
    conn.exec_batch(
        query,
        [(node_pid)].iter().map(|&node_pid| {
            params! {
              "node_pid" => node_pid,
            }
        }),
    )?;
    let id = conn.last_insert_id() as i32;
    return Ok(id);
}
