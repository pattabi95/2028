import React, {useState, useEffect} from "react";

const SIZE = 4;
const emptyGrid = () => Array.from({length: SIZE}, () => Array(SIZE).fill(0));
const addRandom = (grid) => {
  const empties = [];
  grid.forEach((r, i) => r.forEach((c, j) => { if (!c) empties.push([i,j]); }));
  if (!empties.length) return grid;
  const [i,j] = empties[Math.floor(Math.random()*empties.length)];
  const newGrid = grid.map(r => r.slice());
  newGrid[i][j] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
};

function transpose(m) { return m[0].map((_,i) => m.map(r=>r[i])); }
function reverse(m) { return m.map(r => r.slice().reverse()); }

function slideAndMerge(row) {
  const arr = row.filter(v=>v);
  for (let i=0;i<arr.length-1;i++){
    if (arr[i]===arr[i+1]) { arr[i]=arr[i]*2; arr.splice(i+1,1); }
  }
  while (arr.length<row.length) arr.push(0);
  return arr;
}

function move(grid, dir) {
  let rotated = grid;
  if (dir === 'up') { rotated = transpose(grid); }
  if (dir === 'down') { rotated = reverse(transpose(grid)); }
  if (dir === 'right') { rotated = reverse(grid); }

  const moved = rotated.map(r => slideAndMerge(r));
  let restored = moved;
  if (dir === 'up') restored = transpose(moved);
  if (dir === 'down') restored = transpose(reverse(moved));
  if (dir === 'right') restored = reverse(moved);

  return restored;
}

export default function App() {
  const [grid, setGrid] = useState(() => addRandom(addRandom(emptyGrid())));
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const handler = e => {
      const map = {37:'left',38:'up',39:'right',40:'down'};
      const dir = map[e.keyCode];
      if (!dir) return;
      const next = move(grid, dir);
      if (JSON.stringify(next) !== JSON.stringify(grid)) {
        const withNew = addRandom(next);
        setGrid(withNew);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [grid]);

  const reset = () => setGrid(addRandom(addRandom(emptyGrid())));

  return (
    <div style={{fontFamily:'sans-serif',textAlign:'center',padding:20}}>
      <h1>2048 (AWS Demo)</h1>
      <button onClick={reset}>New Game</button>
      <div style={{display:'inline-block',marginTop:12,background:'#bbada0',padding:10,borderRadius:6}}>
        {grid.map((row,ri) => (
          <div key={ri} style={{display:'flex'}}>
            {row.map((cell,ci) => (
              <div key={ci} style={{
                width:80,height:80,display:'flex',alignItems:'center',justifyContent:'center',
                margin:6, background: cell? '#eee4da' : '#cdc1b4', fontSize:24, fontWeight:700, borderRadius:4
              }}>{cell || ''}</div>
            ))}
          </div>
        ))}
      </div>
      <p style={{marginTop:10}}>Use arrow keys to play.</p>
      <div>{msg}</div>
    </div>
  );
}
