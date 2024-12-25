/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ImageSizeControl from '../';

const meta = {
	title: 'BlockEditor/ImageSizeControl',
	component: ImageSizeControl,
	parameters: {
		docs: {
			canvas: { sourceState: 'shown' },
			description: {
				component:
					'Allow users to control the width & height of an image.',
			},
		},
	},
	argTypes: {
		imageSizeHelp: {
			control: 'text',
			description:
				'If this property is added, a help text will be generated for the image size control, using imageSizeHelp property as the content.',
			table: {
				type: { summary: 'string|element' },
			},
		},
		slug: {
			control: 'text',
			description:
				'The currently-selected image size slug (`thumbnail`, `large`, etc). This is used by the parent component to get the specific image, which is used to populate `imageHeight` & `imageWidth`. This is not required, but necessary when `imageSizeOptions` is used.',
			table: {
				type: { summary: 'string' },
			},
		},
		height: {
			control: { type: null },
			description: 'The height of the image when displayed.',
			table: {
				type: { summary: 'number' },
			},
		},
		width: {
			control: { type: null },
			description: 'The width of the image when displayed.',
			table: {
				type: { summary: 'number' },
			},
		},
		onChange: {
			action: 'onChange',
			control: { type: null },
			description:
				'The function called when the image size changes. It is passed an object with `{ width, height }` (potentially just one if only one dimension changed).',
			table: {
				type: { summary: 'function' },
			},
		},
		onChangeImage: {
			action: 'onChangeImage',
			control: { type: null },
			description:
				'The function called when a new image size is selected. It is passed the `slug` as an argument. This is not required, but necessary when `imageSizeOptions` is used.',
			table: {
				type: { summary: 'function' },
			},
		},
		imageSizeOptions: {
			control: 'object',
			description:
				'Array of image size slugs and labels. If not provided, the "Image Size" dropdown is not displayed.',
			table: {
				type: { summary: 'object' },
			},
		},
		isResizable: {
			control: 'boolean',
			description:
				'A boolean control for showing the resize fields "Image Dimensions". Set this to false if you want images to always be the fixed size of the selected image.',
			table: {
				type: { summary: 'boolean' },
			},
		},
		imageWidth: {
			control: 'number',
			description:
				"The width of the currently selected image, used for calculating the percentage sizes. This will likely be updated when the image size slug changes, but does not control the image display (that's the `width` prop).",
			table: {
				type: { summary: 'number' },
			},
		},
		imageHeight: {
			control: 'number',
			description:
				"The height of the currently selected image, used for calculating the percentage sizes. This will likely be updated when the image size slug changes, but does not control the image display (that's the `height` prop).",
			table: {
				type: { summary: 'number' },
			},
		},
	},
};

export default meta;

export const Default = {
	args: {
		imageWidth: 100,
		imageHeight: 100,
		imageSizeOptions: [
			{ value: 'thumbnail', label: 'Thumbnail' },
			{ value: 'medium', label: 'Medium' },
			{ value: 'large', label: 'Large' },
		],
		isResizable: true,
	},
	render: function Template( { onChange, onChangeImage, ...args } ) {
		const [ size, setSize ] = useState( { width: null, height: null } );
		return (
			<ImageSizeControl
				{ ...args }
				onChange={ ( ...changeArgs ) => {
					onChange( ...changeArgs );
					setSize( ...changeArgs );
				} }
				onChangeImage={ ( ...changeArgs ) => {
					onChangeImage( ...changeArgs );
				} }
				width={ size.width }
				height={ size.height }
			/>
		);
	},
};
