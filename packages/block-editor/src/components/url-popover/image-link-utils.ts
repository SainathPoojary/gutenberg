import { __ } from '@wordpress/i18n';
import { image, page } from '@wordpress/icons';
import type { ImageLinkDestination, ImageURLInputUIProps } from './types';

/**
 * Returns the image link destinations shared by the toolbar and inspector.
 *
 * @param options           Media settings.
 * @param options.mediaType Media type.
 * @param options.mediaUrl  Image file URL.
 * @param options.mediaLink Attachment page URL.
 * @return Available destinations.
 */
export function getImageLinkDestinations( {
	mediaType = 'image',
	mediaUrl,
	mediaLink,
}: Pick<
	ImageURLInputUIProps,
	'mediaType' | 'mediaUrl' | 'mediaLink'
> ): ImageLinkDestination[] {
	const destinations: ImageLinkDestination[] = [
		{
			linkDestination: 'media',
			title: __( 'Link to image file' ),
			url: mediaType === 'image' ? mediaUrl : undefined,
			icon: image,
		},
	];
	if ( mediaType === 'image' && mediaLink ) {
		destinations.push( {
			linkDestination: 'attachment',
			title: __( 'Link to attachment page' ),
			url: mediaLink,
			icon: page,
		} );
	}
	return destinations;
}

/**
 * Resolves a URL to a media destination, a custom URL, or no link.
 *
 * @param url          Link URL.
 * @param destinations Available media destinations.
 * @return Link destination.
 */
export function getImageLinkDestination(
	url: string | undefined,
	destinations: Pick< ImageLinkDestination, 'linkDestination' | 'url' >[]
) {
	if ( ! url ) {
		return 'none';
	}
	return (
		destinations.find( ( destination ) => destination.url === url )
			?.linkDestination ?? 'custom'
	);
}

/**
 * Updates the new-tab setting without discarding unrelated link relations.
 *
 * @param opensInNewTab Whether the link opens in a new tab.
 * @param rel           Current link relations.
 * @return Updated target and link relations.
 */
export function getImageLinkTargetSettings(
	opensInNewTab: boolean,
	rel?: string
) {
	const relations = ( typeof rel === 'string' ? rel : '' )
		.split( /\s+/ )
		.filter( Boolean )
		.filter( ( relation ) => relation !== 'noopener' );
	if ( opensInNewTab ) {
		relations.push( 'noopener' );
	}
	return {
		linkTarget: opensInNewTab ? '_blank' : undefined,
		rel: relations.join( ' ' ) || undefined,
	};
}
