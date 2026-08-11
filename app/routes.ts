import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/index.tsx"),
  route("leagues", "routes/leagues/index.tsx"),
  route("leagues/:id", "routes/leagues.$id/index.tsx"),
  route("teams/:id", "routes/teams.$id/index.tsx"),
  route("players/:id", "routes/players.$id/index.tsx"),
  route("events/:id", "routes/events.$id/index.tsx"),
  route("football", "routes/football/index.tsx"),
  route("football/:matchId", "routes/football.$matchId/index.tsx"),
  route("f1", "routes/f1/index.tsx"),
  route("wrestling", "routes/wrestling/index.tsx"),
  route("search", "routes/search/index.tsx"),
  route("search/suggestions", "routes/search.suggestions/index.tsx"),
] satisfies RouteConfig;
