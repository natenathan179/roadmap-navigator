import { createFileRoute, redirect } from "@tanstack/react-router";

// /blog is a common guess for the guides section; send it to the canonical URL.
export const Route = createFileRoute("/blog")({
  beforeLoad: () => {
    throw redirect({ to: "/guides", statusCode: 301 });
  },
});
