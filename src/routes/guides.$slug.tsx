import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { postQuery } from "@/lib/inventory";

export const Route = createFileRoute("/guides/$slug")({
  head: ({ params }) => {
    const readable = params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [
        { title: `${readable} | RV Buying Guide | RV MotorHomes Dealership` },
        {
          name: "description",
          content: `${readable} — practical motorhome buying advice from the team at RV MotorHomes Dealership in Michigan.`,
        },
        { property: "og:title", content: `${readable} | RV Buying Guide` },
        { property: "og:type", content: "article" },
        {
          property: "og:description",
          content: `${readable} — practical motorhome buying advice from working RV dealers.`,
        },
      ],
    };
  },
  component: Guide,
});

function Guide() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useQuery(postQuery(slug));

  if (isLoading) {
    return (
      <div className="container-page max-w-3xl py-16">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="mt-6 h-64 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-2xl font-bold">That guide isn&apos;t published</h1>
        <Button asChild className="mt-6">
          <Link to="/guides">Back to all guides</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="container-page max-w-3xl py-14">
      <Link to="/guides" className="inline-flex items-center text-sm text-muted-foreground hover:text-accent">
        <ArrowLeft className="mr-2 h-4 w-4" /> All guides
      </Link>
      <h1 className="mt-6 font-display text-3xl font-extrabold leading-tight md:text-4xl">{post.title}</h1>
      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {new Date(post.published_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>
      {post.cover_image ? (
        <img
          src={post.cover_image}
          alt=""
          width={1600}
          height={1067}
          className="mt-8 aspect-[3/2] w-full rounded-lg object-cover shadow-card"
        />
      ) : null}
      <div className="mt-10 space-y-5 whitespace-pre-line text-base leading-relaxed text-foreground">
        {post.body}
      </div>

      <div className="mt-14 rounded-lg bg-surface p-7">
        <h2 className="font-display text-lg font-bold">Ready to look at coaches?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Every unit on our lot is inspected, priced publicly and photographed in detail.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/inventory">View Inventory</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/financing">Get Financing</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
