import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("leagues", "routes/leagues.tsx"),
  route("leagues/:id", "routes/leagues.$id.tsx"),
  route("teams/:id", "routes/teams.$id.tsx"),
  route("players/:id", "routes/players.$id.tsx"),
  route("events/:id", "routes/events.$id.tsx"),
  route("search", "routes/search.tsx"),
  route("search/suggestions", "routes/search.suggestions.tsx"),
] satisfies RouteConfig;
