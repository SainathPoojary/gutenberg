/**
 * Internal dependencies
 */
import PlainText from '..';

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Render an auto-growing textarea allow users to fill any textual content.
 */
const meta = {
	title: 'BlockEditor/PlainText',
	component: PlainText,
	argTypes: {
		value: {
			control: 'text',
			description: 'The current text value of the PlainText',
		},
		onChange: {
			action: 'onChange',
			control: {
				type: null,
			},
			description: 'Function called when the text value changes',
		},
		className: {
			control: 'text',
			description: 'Additional class name for the PlainText',
		},
	},
	render: function Render( args ) {
		const [ value, setValue ] = useState( '' );

		const { value: argValue, className, onChange } = args;

		useEffect( () => {
			setValue( argValue );
		}, [ argValue ] );

		const handleOnChange = ( newValue ) => {
			setValue( newValue );
			if ( onChange ) {
				onChange( newValue );
			}
		};

		return (
			<PlainText
				value={ value }
				onChange={ handleOnChange }
				className={ className }
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

/**
 * PlainText component with a long text value to test auto-grow.
 */
export const LongText = {
	args: {
		value: 'Type a long piece of text to see auto-grow in action...',
	},
};

/**
 * PlainText component with a custom class name.
 */
export const WithClassName = {
	args: {
		className: 'my-custom-class',
		value: 'Type some text here...',
	},
};
