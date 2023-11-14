import { useEffect, useState } from 'react';

const postNode = async (node_pid: number) => {
  try {
    await fetch('http://127.0.0.1:3030/api/nodes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ parent_id: node_pid }),
    });
  } catch (_) {
    alert("Please enter the correct id\nNode with this id wasn't found");
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

const HomePage = () => {
  const [nodes, setNodes] = useState<Array<any>>([]);
  const [parentId, setParentId] = useState<number>(0);
  useEffect(() => {
    getNodes(setNodes);
  }, []);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 1000,
          border: '1px solid',
        }}
      >
        <div style={{ textAlign: 'center', border: '1px solid' }}>Tree</div>

        <div
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          {nodes.map((subArr, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                border: '1px solid',
              }}
            >
              {subArr.map((item: any, i: number) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    border: '1px solid',
                    textAlign: 'center',
                    padding: '10px 0',
                  }}
                >
                  [P: {item.node_pid} ID: {item.id}]
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ border: '1px solid', padding: 30 }}>
          Add Node to{' '}
          <input
            onChange={ev => {
              setParentId(parseInt(ev.target.value));
            }}
            style={{ maxWidth: 100 }}
            type="number"
            placeholder="PID"
            value={parentId}
          />
          <br />
          <button
            onClick={async () => {
              await postNode(parentId);
              await getNodes(setNodes);
              setParentId(0);
            }}
          >
            ADD
          </button>
        </div>
      </div>
    </>
  );
};

// export const getServerSideProps = async ({}: NextPageContext) => {
//   const res = await fetch('http://127.0.0.1:3030/api/nodes');

//   const nodes = res.body;

//   return {
//     props: {
//       data: nodes,
//     },
//   };
// };

export default HomePage;
