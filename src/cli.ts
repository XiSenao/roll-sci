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
  .option("--vite-project", "test for vite project")
  .action(async (root, option: GlobalCLIOptions) => {
    const testOption = cleanOptions(option);
    const { injectCodeOnViteProject } = await import(
      "./vite-project-test/inject"
    );
    await injectCodeOnViteProject({ root, ...testOption });
  });
