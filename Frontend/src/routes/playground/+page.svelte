<style>
  .playground-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    border: 2px solid green;
    padding: 10%;
    padding-top: 5%;
  }

  .playground {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10%;
    border: 3px solid white;
    height: 100%;
    width: 100%;
  }

  .plcanvas {
    max-width: 80%;
    max-height: 80%;
    border: 6px solid black;
  }

  .plbuttons {
    max-width: 80%;
    max-height: 20%;
    border: 2px solid purple;
  }

  canvas {
    height: 100%;
    width: 100%;
  }

  button {
    padding: 12px 20px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    background: #007BFF; /* Primary color */
    border: 2px solid #0056b3; /* Darker border */
    border-radius: 0px;
    cursor: pointer;
    transition: background 0.3s, border-color 0.3s, transform 0.2s;
  }

  button:hover {
    background: #0056b3; /* Darker shade on hover */
    border-color: #004080;
    transform: scale(1.05); /* Slight pop effect */
  }

  button:active {
    background: #003d66; /* Even darker on click */
    transform: scale(0.98);
  }
</style>

<Header />

<div class="playground-top">
  <div class="playground">
    <div class="plcanvas"><canvas id="canvas"></canvas></div>

    <div id="controls" class="plbuttons">
      <button id="red">Red Node</button>
      <button id="blue">Blue Node</button>
      <button id="green">Green Node</button>
      <button id="yellow">Yellow Node</button>
      <button id="purple">Purple Node</button>
      <button id="upload">Upload Audio</button>
      <input type="file" id="audioFile" accept="audio/*" style="display: none;">
    </div>
  </div>
</div>


<script>
  import Header from "$lib/Header.svelte";
  import { onMount } from 'svelte';

  onMount(() => {
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const nodes = [];
const edges = [];
let draggingNode = null;

// 🎯 Function to add a node at a given position
function addNode(x, y) {
  nodes.push({ x, y, radius: 10 });
  drawGraph();
}

// 🎯 Function to check if a click is inside a node
function getNodeAtPosition(x, y) {
  return nodes.find(node => {
    return Math.hypot(node.x - x, node.y - y) < node.radius;
  });
}

// 🎯 Function to connect two nodes
function addEdge(node1, node2) {
  edges.push({ node1, node2 });
  drawGraph();
}

// 🎯 Function to draw the graph (nodes + edges)
function drawGraph() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw edges first
  edges.forEach(({ node1, node2 }) => {
    ctx.beginPath();
    ctx.moveTo(node1.x, node1.y);
    ctx.lineTo(node2.x, node2.y);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Draw nodes on top
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();
  });
}

console.log(canvas.getBoundingClientRect());

// 🎯 Mouse event listeners for interaction
canvas.addEventListener("click", (event) => {
  let { offsetX: x, offsetY: y } = event;
  console.log(`Clicked`);
  console.log(`${x} ${y}`);
  const clickedNode = getNodeAtPosition(x, y);

  if (clickedNode) {
    // If clicking an existing node, connect it to the last selected node
    if (nodes.length > 1) {
      addEdge(nodes[nodes.length - 1], clickedNode);
    }
  } else {
    // Otherwise, add a new node
    addNode(x, y);
  }
});

// 🎯 Dragging nodes functionality
canvas.addEventListener("mousedown", (event) => {
  const { offsetX: x, offsetY: y } = event;
  draggingNode = getNodeAtPosition(x, y);
});

canvas.addEventListener("mousemove", (event) => {
  if (draggingNode) {
    draggingNode.x = event.offsetX;
    draggingNode.y = event.offsetY;
    drawGraph();
  }
});

canvas.addEventListener("mouseup", () => {
  draggingNode = null;
});

// 🎯 Resize canvas dynamically
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawGraph();
});

document.getElementById("upload").addEventListener("click", () => {document.getElementById("audioFile").click();});

document.getElementById("audioFile").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const audio = new Audio(URL.createObjectURL(file));
    audio.play();
    console.log("Playing:", file.name);
  }
});

    
  });
</script>

