const http = require("http");
const routes = require("./routes");
const { URL } = require("url");

const server = http.createServer((request, response) => {
  const parsedUrl = new URL(`http://localhost:3000${request.url}`);

  let { pathname } = parsedUrl;
  let id = null;

  const splitEndpoint = pathname.split("/").filter(Boolean);

  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`;
    id = splitEndpoint[1];
  }

  const route = routes.find(
    (routeObj) =>
      routeObj.endpoint === pathname && routeObj.method === request.method
  );

  if (route) {
    request.query = Object.fromEntries(parsedUrl.searchParams);
    request.params = { id };  

    route.handler(request, response);
  } else {
    response.writeHead(404, { "Content-Type": "text-html" });
    response.end(`Cannot ${request.method} ${parsedUrl.pathname}`);
  }

  // if (req.url === "/users" && req.method === "GET") {
  //   UserController.listUsers(req, res);
  // } else {
  // }
});

server.listen(3000, () =>
  console.log("Server started at http://localhost:3000")
);
