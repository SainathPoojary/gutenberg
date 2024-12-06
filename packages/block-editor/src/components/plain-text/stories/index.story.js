/**
 * Internal dependencies
 */
import PlainText from '..';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Render an auto-growing textarea for user input.
 */
const meta = {
	title: 'BlockEditor/PlainText',
	component: PlainText,
	parameters: {
		docs: {
			canvas: { sourceState: 'shown' },
		},
		description: {
			component:
				'PlainText renders an auto-growing textarea that allows users to enter any textual content.',
		},
	},
	argTypes: {
		value: {
			control: {
				type: null,
			},
			table: {
				type: {
					summary: 'string',
				},
			},
			description: 'The current text value of the PlainText',
		},
		onChange: {
			action: 'onChange',
			control: {
				type: null,
			},
			table: {
				type: {
					summary: 'function',
				},
			},
			description: 'Function called when the text value changes',
		},
		className: {
			control: 'text',
			table: {
				type: {
					summary: 'string',
				},
			},
			description: 'Additional class name for the PlainText',
		},
	},
	render: function Template( { onChange, ...args } ) {
		const [ value, setValue ] = useState( args.value );
		return (
			<PlainText
				{ ...args }
				onChange={ ( ...changeArgs ) => {
					onChange( ...changeArgs );
					setValue( ...changeArgs );
				} }
				value={ value }
			/>
		);
	},
};

export default meta;

export const Default = {
	args: {
		className: 'bold',
		value: 'Type some text here...',
	},
};
