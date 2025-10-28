import React from 'react';
import { Workflow } from '../types';
import ExternalLinkIcon from './icons/ExternalLinkIcon';

interface WorkflowDetailProps {
  workflow: Workflow;
  onBack: () => void;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{title}</h2>
        <div className="text-slate-600 dark:text-slate-300 prose prose-sm dark:prose-invert max-w-none">
            {children}
        </div>
    </div>
);

// Helper to parse numbered lists from a string
const renderProcessSummary = (summary: string) => {
  const steps = summary.split(/\s*\d+\.\s*/).filter(Boolean);
  if (steps.length > 1) {
    return (
      <ol className="list-decimal list-inside space-y-2">
        {steps.map((step, index) => (
          <li key={index}>{step.trim()}</li>
        ))}
      </ol>
    );
  }
  return <p>{summary}</p>;
};


const WorkflowDetail: React.FC<WorkflowDetailProps> = ({ workflow, onBack }) => {
  console.log('Workflow JSON:', workflow);
  return (
    <div className="p-4 sm:p-6 md:p-8 animate-fade-in">
        <button 
            onClick={onBack}
            className="mb-6 inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-700 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
            &larr; Back to Workflows
        </button>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">{workflow.title}</h1>
            <p className="text-slate-500 dark:text-slate-400">{workflow.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-4">
            {workflow.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full">{tag}</span>
            ))}
            </div>
        </div>

        <div>
          {/* <n8n-demo workflow='{"nodes":[{"parameters":{},"name":"Start","type":"n8n-nodes-base.start","typeVersion":1,"position":[250,300]},{"parameters":{"conditions":{"string":[{"value1":"=","operation":"notEqual","value2":"54iz37xumjg9ue6bo8ygqifb8y"}]}},"name":"IF","type":"n8n-nodes-base.if","typeVersion":1,"position":[650,300]},{"parameters":{},"name":"NoOp","type":"n8n-nodes-base.noOp","typeVersion":1,"position":[850,160]},{"parameters":{"authentication":"oAuth2","resource":"file","operation":"edit","owner":"mutdmour","repository":"=","filePath":"Dockerfile","fileContent":"=FROM node:14.16-alpine\n\n# pass N8N_VERSION Argument while building or use default\nARG N8N_VERSION=0.98.0\n\n# Update everything and install needed dependencies\nRUN apk add --update graphicsmagick tzdata\n\n# Set a custom user to not have n8n run as root\nUSER root\n\nRUN node --version\n\n# Install n8n and the also temporary all the packages\n# it needs to build it correctly.\n# RUN apk --update add --virtual build-dependencies python build-base && \\\n# \tnpm_config_user=root npm install -g n8n@${N8N_VERSION} && \\\n# \tapk del build-dependencies\n\nRUN apk --update add --virtual build-dependencies python2 python3 build-base && \\\n\tapk --update add git && \\\n\tapk del build-dependencies\n\nRUN N8N_CORE_BRANCH= && \\\n    git clone https://github.com/n8n-io/n8n && \\\n\tcd n8n && \\\n    echo $N8N_CORE_BRANCH && \\\n    git fetch origin $N8N_CORE_BRANCH && \\\n    git checkout $N8N_CORE_BRANCH && \\\n\tnpm install -g typescript && \\\n\tnpm install -g lerna && \\\n\tnpm install && \\\n\tlerna bootstrap --hoist && \\\n\tnpm_config_user=root npm run build \n\n# Specifying work directory\nWORKDIR /data\n\n# copy start script to container\nCOPY ./start.sh /\n\n# make the script executable\nRUN chmod +x /start.sh\n\n# define execution entrypoint\nCMD [\"/start.sh\"]","commitMessage":"=n8n bot - deploy branch "},"name":"GitHub","type":"n8n-nodes-base.github","typeVersion":1,"position":[1210,480],"credentials":{"githubOAuth2Api":{"id":"40","name":"Github account"}}},{"parameters":{"functionCode":"const responseUrl = items[0].json.body.response_url;\nconst text = items[0].json.body.text;\nconst [todeploy, branch] = text.split();\nconst instances = todeploy.split();\nreturn Array.from(new Set(instances)).map((name) => ({\n  json: {\n    name,\n    repo: `n8n-heroku-${name}`,\n    branch,\n    responseUrl,\n    instanceUrl: `https://n8n-${name}.herokuapp.com/`,\n    username: name,\n    password: test1234\n  }\n}));\n"},"name":"Function1","type":"n8n-nodes-base.function","typeVersion":1,"position":[850,430]},{"parameters":{},"name":"NoOp1","type":"n8n-nodes-base.noOp","typeVersion":1,"position":[1000,520]},{"parameters":{"mode":"passThrough","output":"input2"},"name":"Merge","type":"n8n-nodes-base.merge","typeVersion":1,"position":[1260,770]},{"parameters":{"requestMethod":"POST","url":"=","responseFormat":"string","options":{},"bodyParametersUi":{"parameter":[{"name":"text","value":"=Updated  with \"\" branch. Should take effect in 10 or so minutes.\nYou can follow its progress here https://github.com/mutdmour/n8n-heroku-/deployments/activity_log?environment=n8n-\n\nURL: \nusername: \npassword: "}]}},"name":"HTTP Request","type":"n8n-nodes-base.httpRequest","typeVersion":1,"position":[1460,770]},{"parameters":{"httpMethod":"POST","path":"5b44d7e0-0221-4886-a416-0070ac8cae67","options":{}},"name":"Webhook","type":"n8n-nodes-base.webhook","typeVersion":1,"position":[430,290],"webhookId":"5b44d7e0-0221-4886-a416-0070ac8cae67"}],"connections":{"IF":{"main":[[{"node":"NoOp","type":"main","index":0}],[{"node":"Function1","type":"main","index":0}]]},"GitHub":{"main":[[{"node":"Merge","type":"main","index":0}]]},"Function1":{"main":[[{"node":"NoOp1","type":"main","index":0}]]},"NoOp1":{"main":[[{"node":"GitHub","type":"main","index":0},{"node":"Merge","type":"main","index":1}]]},"Merge":{"main":[[{"node":"HTTP Request","type":"main","index":0}]]},"Webhook":{"main":[[{"node":"IF","type":"main","index":0}]]}}}' frame="true"></n8n-demo> */}
          {workflow.workflowJson && <n8n-demo workflow={workflow.workflowJson} frame="true"></n8n-demo> }
        </div>
        
        <DetailSection title="Input Details">
            <p>{workflow.inputDetails || 'No input details provided.'}</p>
        </DetailSection>

        <DetailSection title="Process Summary">
            {renderProcessSummary(workflow.processSummary || 'No process summary provided.')}
        </DetailSection>
        
        <DetailSection title="Output Details">
            <p>{workflow.outputDetails || 'No output details provided.'}</p>
        </DetailSection>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
            <a href={workflow.workflowUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                View Workflow
                <ExternalLinkIcon className="ml-2 h-4 w-4" />
            </a>
            <a href={workflow.markdownUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                View Markdown
                <ExternalLinkIcon className="ml-2 h-4 w-4" />
            </a>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDetail;
