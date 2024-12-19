/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import PanelColorSettings from '../';

const meta = {
	title: 'BlockEditor/PanelColorSettings',
	component: PanelColorSettings,
	parameters: {
		docs: {
			canvas: { sourceState: 'shown' },
			description: {
				component:
					'The `PanelColorSettings` component provides a UI for managing color settings. It wraps the `PanelColorGradientSettings` component while specifically disabling gradient features.',
			},
		},
	},
	argTypes: {
		colorSettings: {
			description: 'Array of color setting objects',
			control: { type: 'object' },
			table: {
				type: {
					summary:
						'Array<{ value: string, onChange: Function, label: string }>',
				},
			},
		},
	},
};

export default meta;

export const Default = {
	render: function Template( args ) {
		const [ color, setColor ] = useState( '#0F52BA' );

		return (
			<PanelColorSettings
				{ ...args }
				colorSettings={ [
					{
						value: color,
						onChange: ( newColor ) => {
							setColor( newColor );
						},
						label: __( 'Color' ),
						colors: [
							{ name: __( 'Sapphire Blue' ), color: '#0F52BA' },
							{ name: __( 'Emerald Green' ), color: '#50C878' },
							{ name: __( 'Ruby Red' ), color: '#E0115F' },
							{ name: __( 'Amethyst Purple' ), color: '#9966CC' },
							{ name: __( 'Topaz Yellow' ), color: '#FFC87C' },
						],
					},
				] }
			/>
		);
	},
};

export const WithAdditionalProps = {
	...Default,
	args: {
		title: __( 'Color' ),
		showTitle: true,
		__experimentalIsRenderedInSidebar: true,
		disableCustomColors: false,
		disableCustomGradients: false,
		disableDefaultColors: false,
		disableDefaultGradients: false,
		disableGradients: false,
		enableAlpha: true,
	},
};
