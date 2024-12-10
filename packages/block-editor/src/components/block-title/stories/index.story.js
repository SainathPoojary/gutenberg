/**
 * WordPress dependencies
 */
import { registerCoreBlocks } from '@wordpress/block-library';
import { createBlock } from '@wordpress/blocks';
import { BlockEditorProvider } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import BlockTitle from '../';

// Register core blocks for the story environment
registerCoreBlocks();

// Create sample blocks for testing
const blocks = [
	createBlock( 'core/paragraph', {
		content: 'This is a sample paragraph block.',
		className: 'sample-paragraph',
	} ),
	createBlock( 'core/heading', {
		level: 2,
		content: 'Sample Heading Block',
	} ),
	createBlock( 'core/group', {
		layout: { type: 'flex', justifyContent: 'center' },
	} ),
];

/**
 * Storybook configuration for BlockTitle component
 */
const meta = {
	title: 'BlockEditor/BlockTitle',
	component: BlockTitle,
	parameters: {
		docs: {
			canvas: { sourceState: 'shown' },
			description: {
				component:
					"Renders the block's configured title as a string, or empty if the title cannot be determined.",
			},
		},
	},
	decorators: [
		( Story ) => (
			<BlockEditorProvider value={ blocks }>
				<Story />
			</BlockEditorProvider>
		),
	],
	argTypes: {
		clientId: {
			control: {
				type: 'select',
				labels: {
					[ blocks[ 0 ].clientId ]: "Paragraph's Client ID",
					[ blocks[ 1 ].clientId ]: "Heading's Client ID",
					[ blocks[ 2 ].clientId ]: "Group's Client ID",
				},
			},
			options: [
				blocks[ 0 ].clientId,
				blocks[ 1 ].clientId,
				blocks[ 2 ].clientId,
			],
			description: 'Client ID of block.',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		maximumLength: {
			control: {
				type: 'number',
				min: 5,
				max: 50,
				step: 1,
			},
			description:
				'The maximum length that the block title string may be before truncated.',
			table: {
				type: {
					summary: 'number',
				},
			},
		},
		context: {
			control: { type: 'text' },
			description: 'The context to pass to `getBlockLabel`.',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
	},
};

export default meta;

/**
 * Story variations demonstrating BlockTitle component capabilities
 */
export const Default = {
	args: {
		clientId: blocks[ 0 ].clientId,
	},
};
