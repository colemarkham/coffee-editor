/*
 * generated by Xtext 2.12.0
 */
package com.eclipsesource.workflow.dsl.ide

import com.eclipsesource.workflow.dsl.ide.contentassist.WorkflowIdeContentProposalProvider
import org.eclipse.xtext.ide.editor.contentassist.IdeContentProposalProvider

/**
 * Use this class to register ide components.
 */
class WorkflowIdeModule extends AbstractWorkflowIdeModule {
	
	def Class<? extends IdeContentProposalProvider> bindIdeContentProposalProvider() {
		WorkflowIdeContentProposalProvider
	}
}
