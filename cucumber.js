module.exports = {
  default: {
    formatOptions: {
      snippetInterface: "async-await",
    },
    dryRun: false,
    requireModule: ["ts-node/register"],
    paths: ["cucumber/features/"],
    require: ["cucumber/steps/*.ts"],
  },
};
