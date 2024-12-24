import { SlackApp, SlackEdgeAppEnv } from "slack-cloudflare-workers";

export default {
  async fetch(
    request: Request,
    env: SlackEdgeAppEnv,
    ctx: ExecutionContext
  ): Promise<Response> {
	const app = new SlackApp({ env });
app.command("/hey-cf-workers",
  // "ack" 関数は 3 秒以内に完了する必要があります
  async (_req) => {
    // このテキストはアプリからのエフェメラルメッセージとして送信されます
    return "What's up?";
  },
  // "lazy" 関数では 3 秒の制約はなく、非同期で実行したい処理を何でもできます
  async (req) => {
    await req.context.respond({
      text: "Hey! This is an async response!"
    });
  }
);

app.event("app_mention", async ({ context }) => {
	await context.say({
	  text: `<@${context.userId}> さん、何かご用ですか？`
	});
  });

return await app.run(request, ctx);
  },
};
//slackbotを実装しています