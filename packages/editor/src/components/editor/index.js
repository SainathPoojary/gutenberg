/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { TEMPLATE_POST_TYPE } from '../../store/constants';
import EditorInterface from '../editor-interface';
import { ExperimentalEditorProvider } from '../provider';
import Sidebar from '../sidebar';

function Editor( {
	postType,
	postId,
	templateId,
	settings,
	children,
	initialEdits,

	// This could be part of the settings.
	onActionPerformed,

	// The following abstractions are not ideal but necessary
	// to account for site editor and post editor differences for now.
	extraContent,
	extraSidebarPanels,
	...props
} ) {
	const { post, template, hasLoadedPost, error } = useSelect(
		( select ) => {
			const {
				getEntityRecord,
				getResolutionError,
				hasFinishedResolution,
			} = select( coreStore );

			const postArgs = [ 'postType', postType, postId ];
			return {
				post: getEntityRecord( ...postArgs ),
				template: templateId
					? getEntityRecord(
							'postType',
							TEMPLATE_POST_TYPE,
							templateId
					  )
					: undefined,
				hasLoadedPost: hasFinishedResolution(
					'getEntityRecord',
					postArgs
				),
				error: getResolutionError( 'getEntityRecord', postArgs )
					?.message,
			};
		},
		[ postType, postId, templateId ]
	);

	return (
		<>
			{ hasLoadedPost && ! post && (
				<Notice
					status={ !! error ? 'error' : 'warning' }
					isDismissible={ false }
				>
					{ ! error
						? __(
								"You attempted to edit an item that doesn't exist. Perhaps it was deleted?"
						  )
						: error }
				</Notice>
			) }
			{ !! post && (
				<ExperimentalEditorProvider
					post={ post }
					__unstableTemplate={ template }
					settings={ settings }
					initialEdits={ initialEdits }
					useSubRegistry={ false }
				>
					<EditorInterface { ...props }>
						{ extraContent }
					</EditorInterface>
					{ children }
					<Sidebar
						onActionPerformed={ onActionPerformed }
						extraPanels={ extraSidebarPanels }
					/>
				</ExperimentalEditorProvider>
			) }
		</>
	);
}

export default Editor;
