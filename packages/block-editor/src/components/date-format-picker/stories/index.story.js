/**
 * Internal dependencies
 */
import DateFormatPicker from '..';

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Date format options
 */
const FORMAT_OPTIONS = [
	null,
	'Y-m-d',
	'n/j/Y',
	'n/j/Y g:i A',
	'M j, Y',
	'M j, Y g:i A',
	'F j, Y',
	'M j',
];

/**
 * Storybook configuration for DateFormatPicker component
 */
export default {
	title: 'BlockEditor/DateFormatPicker',
	component: DateFormatPicker,
	argTypes: {
		defaultFormat: {
			control: 'text',
			description: 'Default date format to display',
		},
		format: {
			control: 'select',
			options: FORMAT_OPTIONS,
			description: 'Selected date format',
		},
		onChange: {
			action: 'onChange',
			control: {
				type: null,
			},
			description: 'Callback function when date format changes',
		},
	},
	render: function Render( { onChange, format, defaultFormat } ) {
		const [ selectedFormat, setSelectedFormat ] = useState( format );

		useEffect( () => {
			setSelectedFormat( format );
		}, [ format ] );

		const handleFormatChange = ( newValue ) => {
			setSelectedFormat( newValue );
			if ( onChange ) {
				onChange( newValue );
			}
		};

		return (
			<DateFormatPicker
				defaultFormat={ defaultFormat }
				format={ selectedFormat }
				onChange={ handleFormatChange }
			/>
		);
	},
};

/**
 * Story demonstrating DateFormatPicker with default settings
 */
export const Default = {
	args: {
		defaultFormat: 'M j, Y',
		format: 'Y-m-d',
	},
};

/**
 * DateFormatPicker with format set to null and defaultFormat set to 'M j, Y'
 */
export const WithFormatNull = {
	args: {
		defaultFormat: 'M j, Y',
		format: null,
	},
};

/**
 * DateFormatPicker with defaultFormat set to empty string and format set to 'Y-m-d'
 */
export const WithDefaultFormatEmpty = {
	args: {
		defaultFormat: '',
		format: 'Y-m-d',
	},
};
