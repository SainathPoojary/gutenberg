/**
 * Internal dependencies
 */
import URLInput from '../';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

const meta = {
	title: 'BlockEditor/URLInput',
	component: URLInput,
	parameters: {
		docs: {
			canvas: { sourceState: 'shown' },
			description: {
				component:
					'Renders the URL input field used by the `URLInputButton` component. It can be used directly to display the input field in different ways such as in a `Popover` or inline.',
			},
		},
	},
	argTypes: {
		value: {
			description:
				'This should be set to the attribute (or component state) property used to store the URL.',
			type: { name: 'string', required: true },
			control: 'text',
		},
		onChange: {
			action: 'onChange',
			description:
				'Called when the value changes. The second parameter is `null` unless the user selects a post from the suggestions dropdown.',
			type: { name: 'function', required: true },
			control: { type: null },
		},
		onKeyDown: {
			action: 'onKeyDown',
			description: 'A callback invoked on the keydown event.',
			type: { name: 'function' },
			control: { type: null },
		},
		label: {
			description:
				'If this property is added, a label will be generated using label property as the content.',
			type: { name: 'string' },
			control: 'text',
		},
		className: {
			description:
				'Adds and optional class to the parent `div` that wraps the URLInput field and popover',
			type: { name: 'string' },
			control: 'text',
		},
		placeholder: {
			description:
				'Placeholder text to show when the field is empty, similar to the [input and textarea attribute of the same name](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/HTML5_updates#The_placeholder_attribute).',
			type: { name: 'string' },
			control: 'text',
		},
		disableSuggestions: {
			description:
				'Provides additional control over whether suggestions are disabled.',
			type: { name: 'boolean' },
			control: 'boolean',
		},
	},
};

export default meta;

export const Default = {
	render: function Template( { onChange, ...args } ) {
		const [ value, setValue ] = useState();
		return (
			<URLInput
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
