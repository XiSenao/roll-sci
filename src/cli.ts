import { cac } from "cac";
import type { GlobalCLIOptions } from "dep-types/cli";
const cli = cac("sci");

const cleanOptions = (option: GlobalCLIOptions) => {
  const re = { ...option };
  delete re["--"];
  return re;
};

cli
  .command("test", "test for production")
  .option("--vite", "test for vite project")
  .action(async (root, option: GlobalCLIOptions) => {
    if (root.vite) {
      console.log(`------------------------ Test for vite project ------------------------\n`);
      const testOption = cleanOptions(option);
      const { injectCodeOnViteProject } = await import(
        "./vite-project-test/inject"
      );
      await injectCodeOnViteProject({ root, ...testOption });
    }
  });
