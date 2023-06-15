const http = require('http');
const url = require('url');
const querystring = require('querystring');

const majors = [
  { id: 1, majorName: 'Computer Science', difficulty: 'Medium' },
  { id: 2, majorName: 'Mathematics', difficulty: 'Hard' },
];

function renderHome(response) {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write('<!DOCTYPE html>');
  response.write('<html>');
  response.write('<head>');
  response.write('<title>School Major Management System</title>');
  response.write('</head>');
  response.write('<style>');
  response.write('table { font-family: arial, sans-serif; border-collapse: collapse; width: 100%; }');
  response.write('td, th { border: 1px solid #dddddd; text-align: left; padding: 8px; }');
  response.write('tr:nth-child(even) { background-color: #dddddd; }');
  response.write('</style>');
  response.write('<body>');
  response.write('<button id="addBtn">Add Major</button>');
  response.write('<button id="viewBtn">View and Delete Majors</button>');
  response.write('<button id="updateBtn">Update Major</button>');
  response.write('<form id="addMajorForm" style="display: none" action="/" method="post">');
  response.write('<input type="number" placeholder="ID" name="majorID" required />');
  response.write('<input type="text" placeholder="Major Name" name="majorName" required />');
  response.write('<input type="text" placeholder="Difficulty" name="difficulty" required />');
  response.write('<button type="submit">Add</button>');
  response.write('</form>');
  response.write('<table id="viewMajorTable" style="display: none">');
  response.write('<tr>');
  response.write('<th>ID</th>');
  response.write('<th>Major Name</th>');
  response.write('<th>Difficulty</th>');
  response.write('<th>Delete</th>');
  response.write('</tr>');
  majors.forEach((major) => {
    response.write('<tr>');
    response.write(`<td>${major.id}</td>`);
    response.write(`<td>${major.majorName}</td>`);
    response.write(`<td>${major.difficulty}</td>`);
    response.write(`<td><form action="/delete" method="post">`);
    response.write(`<input type="hidden" name="majorName" value="${major.majorName}" />`);
    response.write('<button type="submit">Delete</button>');
    response.write('</form></td>');
    response.write('</tr>');
  });
  response.write('</table>');
  response.write('<form action="/update" method="post" id="updateMajorForm" style="display: none">');
  response.write('<input type="number" placeholder="Major ID" name="id" required />');
  response.write('<input type="text" placeholder="Major Name" name="majorName" required />');
  response.write('<input type="text" placeholder="Difficulty" name="difficulty" required />');
  response.write('<button type="submit">Update</button>');
  response.write('</form>');
  response.write('<script>');
  response.write('function showAddForm() {');
  response.write('document.getElementById("addMajorForm").style.display = "block";');
  response.write('document.getElementById("viewMajorTable").style.display = "none";');
  response.write('document.getElementById("updateMajorForm").style.display = "none";');
  response.write('}');
  response.write('function showViewTable() {');
  response.write('document.getElementById("viewMajorTable").style.display = "block";');
  response.write('document.getElementById("addMajorForm").style.display = "none";');
  response.write('document.getElementById("updateMajorForm").style.display = "none";');
  response.write('}');
  response.write('function showUpdateForm() {');
  response.write('document.getElementById("updateMajorForm").style.display = "block";');
  response.write('document.getElementById("addMajorForm").style.display = "none";');
  response.write('document.getElementById("viewMajorTable").style.display = "none";');
  response.write('}');
  response.write('document.getElementById("addBtn").addEventListener("click", showAddForm);');
  response.write('document.getElementById("viewBtn").addEventListener("click", showViewTable);');
  response.write('document.getElementById("updateBtn").addEventListener("click", showUpdateForm);');
  response.write('document.addEventListener("DOMContentLoaded", function () {');
  response.write('showViewTable();');
  response.write('});');
  response.write('</script>');
  response.write('</body>');
  response.write('</html>');
  response.end();
}

function addMajor(request, response) {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();
  });
  request.on('end', () => {
    const { majorID, majorName, difficulty } = querystring.parse(body);
    const newMajor = {
      id: parseInt(majorID),
      majorName,
      difficulty,
    };
    majors.push(newMajor);
    response.writeHead(302, { Location: '/' });
    response.end();
  });
}

function deleteMajor(request, response) {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();
  });
  request.on('end', () => {
    const { majorName } = querystring.parse(body);
    const index = majors.findIndex((major) => major.majorName === majorName);
    if (index !== -1) {
      majors.splice(index, 1);
    }
    response.writeHead(302, { Location: '/' });
    response.end();
  });
}

function updateMajor(request, response) {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();
  });
  request.on('end', () => {
    const { id, majorName, difficulty } = querystring.parse(body);
    const index = majors.findIndex((major) => major.id === parseInt(id));
    if (index !== -1) {
      majors[index].majorName = majorName;
      majors[index].difficulty = difficulty;
    }
    response.writeHead(302, { Location: '/' });
    response.end();
  });
}

function handleRequest(request, response) {
  const path = url.parse(request.url).pathname;
  if (request.method === 'GET' && path === '/') {
    renderHome(response);
  } else if (request.method === 'POST' && path === '/') {
    addMajor(request, response);
  } else if (request.method === 'POST' && path === '/delete') {
    deleteMajor(request, response);
  } else if (request.method === 'POST' && path === '/update') {
    updateMajor(request, response);
  } else {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('404 Not Found');
    response.end();
  }
}

const server = http.createServer(handleRequest);
server.listen(3003, () => {
  console.log('App is running on port 3003');
});
