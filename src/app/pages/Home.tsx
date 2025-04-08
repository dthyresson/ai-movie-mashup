import type { AppContext } from "@/worker";

export function Home({ ctx }: { ctx: AppContext }) {
  return (
    <div>
      <p>
        {ctx.user?.username
          ? `You are logged in as user ${ctx.user.username}`
          : "You are not logged in"}
      </p>
    </div>
  );
}
