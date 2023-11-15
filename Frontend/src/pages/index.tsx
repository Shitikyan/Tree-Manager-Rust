import { useEffect, useState } from 'react';
import 'dotenv/config';

import styles from './styles.module.css';

const postNode = async (node_pid: number, setError: (err: string) => void) => {
  try {
    await fetch('http://127.0.0.1:3030/api/nodes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ parent_id: node_pid }),
    });
  } catch (_) {
    setError("Please enter the correct id. Node with this id wasn't found.");
  }
};

const getNodes = async (callBack: (arg: any) => void) => {
  const res = await fetch('http://127.0.0.1:3030/api/nodes');
  const nodes_str = await res.json();
  const nodes = JSON.parse(nodes_str);
  const groupedItems = nodes.reduce((acc: any[], item: any) => {
    const parentId = item.node_pid;
    acc[parentId] = acc[parentId] || [];
    acc[parentId].push(item);
    return acc;
  }, {});

  const result = Object.values(groupedItems).sort(
    (a: any, b: any) => a[0].node_pid - b[0].node_pid,
  );

  callBack(result);
};

type TNode = { node_pid: number; id: number };
type Matrix<T> = Array<Array<T>>;

const HomePage = ({ result }: { result: Matrix<TNode> }) => {
  const [nodes, setNodes] = useState<Matrix<TNode>>(result);
  const [errMessage, setErrMessage] = useState<string>('');
  const [parentId, setParentId] = useState<number>(0);
  useEffect(() => {
    if (!result || result.length === 0) {
      getNodes(setNodes);
    }
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>Tree Manager</div>
        <div className={styles.box}>
          {nodes?.map((subArr, i) => (
            <div className={styles.row} key={i}>
              {subArr.map((item: any, i: number) => (
                <div className={styles.element} key={i}>
                  [P: {item.node_pid} ID: {item.id}]
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={styles.controls}>
          Add Node to{' '}
          <input
            onChange={ev => {
              setErrMessage('');
              setParentId(parseInt(ev.target.value));
            }}
            style={{ maxWidth: 50 }}
            type="number"
            placeholder="PID"
            value={parentId}
          />
          <br />
          <div className={styles.button_box}>
            {errMessage && <p>{errMessage}</p>}
            <button
              onClick={async () => {
                await postNode(parentId, setErrMessage);
                await getNodes(setNodes);
                setParentId(0);
              }}
            >
              ADD
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/nodes`);
  const nodes_str = await res.json();
  const nodes = JSON.parse(nodes_str);
  const groupedItems = nodes.reduce((acc: any[], item: any) => {
    const parentId = item.node_pid;
    acc[parentId] = acc[parentId] || [];
    acc[parentId].push(item);
    return acc;
  }, {});

  const result = Object.values(groupedItems).sort(
    (a: any, b: any) => a[0].node_pid - b[0].node_pid,
  );

  return {
    props: {
      data: result,
    },
  };
};

export default HomePage;
