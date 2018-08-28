import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, Command, SelectionService } from "@theia/core/lib/common";
import { injectable, inject } from "inversify";
import { WorkflowClientContribution } from "./language-contribution";
import { ExecuteCommandRequest, Workspace } from "@theia/languages/lib/common";
import { EditorManager, EDITOR_CONTEXT_MENU } from "@theia/editor/lib/browser";
import { isString } from "util";
import { UriAwareCommandHandler, UriCommandHandler } from "@theia/core/lib/common/uri-command-handler"
import URI from "@theia/core/lib/common/uri";
import { OpenerService } from "@theia/core/lib/browser";

export const CODEGEN_COMMAND: Command = {
    id: "workflow.generate.code.command",
    label: "Generate Workflow code"
}
@injectable()
export class WorkflowCommandContribution implements CommandContribution, MenuContribution {


    constructor(
        @inject(WorkflowClientContribution)
        protected readonly clientContributon: WorkflowClientContribution,
        @inject(Workspace)
        protected readonly workspace: Workspace,
        @inject(EditorManager)
        protected readonly editorManager: EditorManager,
        @inject(SelectionService) protected readonly selectionService: SelectionService,
        @inject(OpenerService) protected readonly openHandler: OpenerService
    ) { }

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction([...EDITOR_CONTEXT_MENU, '0_addition'], {
            commandId: CODEGEN_COMMAND.id,
            label: 'Generate Workflow code'
        })
    }
    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(CODEGEN_COMMAND, this.newUriAwareCommandHandler({
            execute: async (uri) => {
                const rootPath = this.workspace.rootPath
                if (isString(rootPath)) {
                    const client = await this.clientContributon.languageClient;
                    const result = await client.sendRequest(ExecuteCommandRequest.type, {
                        command: "workflow.project.build",
                        arguments: [rootPath]
                    });
                    return result;
                }


            },
            isVisible: (uri) => uri.toString().endsWith("wf"),
            isEnabled: (uri) => uri.toString().endsWith("wf")

        }),

        );
    }

    protected newUriAwareCommandHandler(handler: UriCommandHandler<URI>): UriAwareCommandHandler<URI> {
        return new UriAwareCommandHandler(this.selectionService, handler)

    };
}