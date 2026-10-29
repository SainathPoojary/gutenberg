import { SelectControl as WCSelectControl } from '@wordpress/components';
import { privateApis as blockEditorPrivateApis } from '@wordpress/block-editor';
import { Stack } from '@wordpress/ui';
import { __ } from '@wordpress/i18n';
import { getSuggestionsQuery, useLinkPreview } from './link-picker';
import { unlock } from '../lock-unlock';

const { LinkPicker, getImageLinkDestination } = unlock(
	blockEditorPrivateApis
);

interface LinkDestination {
	value: string;
	label: string;
	url?: string;
}

interface LinkDestinationControlProps {
	value: string;
	href?: string;
	destinations: LinkDestination[];
	onChange: ( destination: string, href?: string ) => void;
}

function CustomUrlControl( {
	href,
	onChange,
}: Pick< LinkDestinationControlProps, 'href' > & {
	onChange: ( url?: string ) => void;
} ) {
	const preview = useLinkPreview( { url: href } );

	return (
		<LinkPicker
			label={ __( 'Custom URL' ) }
			preview={ preview }
			suggestionsQuery={ getSuggestionsQuery() }
			onSelect={ ( { url }: { url?: string } ) => onChange( url ) }
		/>
	);
}

/** An inspector field for image link destinations and custom URLs. */
export default function LinkDestinationControl( {
	value,
	href,
	destinations,
	onChange,
}: LinkDestinationControlProps ) {
	const options = destinations.map( ( { value: optionValue, label } ) => ( {
		value: optionValue,
		label,
	} ) );
	options.push( { value: 'custom', label: __( 'Custom URL' ) } );

	return (
		<Stack direction="column" gap="md">
			<WCSelectControl
				label={ __( 'Link to' ) }
				value={ value }
				options={ options }
				onChange={ ( destination ) =>
					onChange(
						destination,
						destination === 'custom'
							? href
							: destinations.find(
									( option ) => option.value === destination
								)?.url
					)
				}
			/>
			{ value === 'custom' && (
				<CustomUrlControl
					href={ href }
					onChange={ ( url ) => {
						const destination = getImageLinkDestination(
							url,
							destinations.map( ( option ) => ( {
								linkDestination: option.value,
								url: option.url,
							} ) )
						);
						onChange( destination, url );
					} }
				/>
			) }
		</Stack>
	);
}
