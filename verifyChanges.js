const fs = require('fs');
const JupiterOneChangeManagementClient = require('@jupiterone/jupiter-change-management-client');

(async function() {
  const jupiterOneAccount = process.argv[2];
  const jupiterOneIntegrationInstanceId = process.argv[3];

  const commitRange = process.argv[4];
  const [base, head] = commitRange.split("...");
  console.log({ base, head });

  let j1Token;
  try {
    j1Token = fs.readFileSync("./secret.txt").toString();
  } catch (err) {
    console.log(err);
    exit(1);
  }

  const cmClient = await new JupiterOneChangeManagementClient(
    jupiterOneAccount,
    jupiterOneIntegrationInstanceId,
    j1Token
  ).init();

  await cmClient.collectPREntities(
    [
      {
        username: 'JupiterOne',
        repoSlug: 'jupiter-integration-jira',
        sha: '31004ce765ce3af250070332fdf2779a246de1e1'
      }
    ],
    [
      {
        username: 'JupiterOne',
        repoSlug: 'jupiter-integration-jira',
        sha: 'be70fd290cf31a40e56a6954285577eae303cc6c'
      }
    ]
  );

  const reviewProcessVerdict = cmClient.buildReviewProcessComment();

  console.log(reviewProcessVerdict.text);

  if (reviewProcessVerdict.verdict === "NEEDS_HUMAN_REVIEW") {
    throw "Needs human review!";
  }
})().then(() => {
  exit(0, "Changes verified!");
}).catch((reason) => {
  exit(1, reason);
});

