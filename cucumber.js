module.exports = {
  default: {
    formatOptions: {
      snippetInterface: "async-await",
    },
    dryRun: false,
    requireModule: ["ts-node/register"],
    paths: ["tests/features/"],
    require: ["tests/steps/*.ts"],
  },
};
