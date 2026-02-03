To start demo:

- Start db: `cd backend` && `node .\server.js` _Note: need local DB setup_
- Start q-lab: `cd .\apps\q-lab` && `npm run dev`
- Start q-lab: `cd .\apps\course-assistant` && `npm run dev`

Backend pipeline flow:

- Using `simple-git` to control the commit
- TODO: need to create personal access token from git so that I can push automatically
- TODO: local works but want to deploy and test with actual website
- TODO: create a more detailed pipeline + agents to write unit tests and stuff

Repo reference structure:

```
slh-v2/
├── apps/                     # Applications
│   ├── course-assistant/     # Instructor-facing React/TypeScript app
│   ├── ai-tutor/            # Student-facing React/TypeScript app
│   └── vscode-extension/    # VS Code extension (TypeScript)
│
├── backend/                  # Python backend
│   ├── src/
│   │   ├── ai/              # AI subsystem components
│   │   ├── api/             # Request and response formats for APIs
│   │   ├── config/          # Configuration constants
│   │   ├── endpoints/       # FastAPI endpoints
│   │   ├── mock_data/       # Mock data for development and testing
│   │   ├── models/          # Pydantic data models
│   │   │   └── question_types/  # Question type definitions
│   │   ├── persistence/     # Database and storage layer
│   │   └── services/        # Business logic
│   ├── scripts/             # Development utilities
│   ├── Makefile            # Development commands
│   └── pyproject.toml      # Python dependencies and tooling
│
├── common/                  # Shared resources
│   ├── ts-types/           # Auto-generated TypeScript types
│   ├── api-client/         # Auto-generated API client
│   ├── components/         # Shared React components
│   └── utils/              # Shared utilities
│
├── docs/                   # Project documentation
└── package.json           # Workspace configuration
```
