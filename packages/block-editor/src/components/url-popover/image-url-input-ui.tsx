import { __ } from '@wordpress/i18n';
import {
	useRef,
	useEffect,
	useState,
	createInterpolateElement,
} from '@wordpress/element';
import { focus } from '@wordpress/dom';
import {
	ToolbarButton,
	NavigableMenu,
	Button,
	MenuItem,
	ToggleControl,
	TextControl,
	__experimentalVStack as VStack,
	ExternalLink,
} from '@wordpress/components';
import { Icon, link as linkIcon, fullscreen, linkOff } from '@wordpress/icons';
import { prependHTTPS } from '@wordpress/url';
import type { FormEvent, ReactNode, RefObject, SyntheticEvent } from 'react';
import URLPopover from './index';
import type { ImageURLInputUIProps } from './types';
import {
	getImageLinkDestinations,
	getImageLinkDestination,
	getImageLinkTargetSettings,
} from './image-link-utils';

const LINK_DESTINATION_NONE = 'none';
const LINK_DESTINATION_MEDIA = 'media';
const LINK_DESTINATION_ATTACHMENT = 'attachment';

const ImageURLInputUI = ( {
	linkDestination,
	onChangeUrl,
	url,
	mediaType = 'image',
	mediaUrl,
	mediaLink,
	linkTarget,
	linkClass,
	rel,
	showLightboxSetting,
	lightboxEnabled,
	onSetLightbox,
	resetLightbox,
}: ImageURLInputUIProps ) => {
	const linkDestinations = getImageLinkDestinations( {
		mediaType,
		mediaUrl,
		mediaLink,
	} );
	const [ isOpen, setIsOpen ] = useState( false );
	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [ popoverAnchor, setPopoverAnchor ] = useState< Element | null >(
		null
	);
	const openLinkUI = () => {
		setIsOpen( true );
	};

	const [ isEditingLink, setIsEditingLink ] = useState( false );
	const [ urlInput, setUrlInput ] = useState< string | null >( null );

	const autocompleteRef = useRef< HTMLDivElement >( null );
	const wrapperRef = useRef< HTMLDivElement >( undefined );

	useEffect( () => {
		if ( ! wrapperRef.current ) {
			return;
		}
		const nextFocusTarget =
			focus.focusable.find( wrapperRef.current )[ 0 ] ||
			wrapperRef.current;
		nextFocusTarget.focus();
	}, [ isEditingLink, url, lightboxEnabled ] );

	const startEditLink = () => {
		if (
			linkDestination === LINK_DESTINATION_MEDIA ||
			linkDestination === LINK_DESTINATION_ATTACHMENT
		) {
			setUrlInput( '' );
		}
		setIsEditingLink( true );
	};

	const stopEditLink = () => {
		setIsEditingLink( false );
	};

	const closeLinkUI = () => {
		setUrlInput( null );
		stopEditLink();
		setIsOpen( false );
	};

	const onFocusOutside = () => {
		return ( event: SyntheticEvent ) => {
			// The autocomplete suggestions list renders in a separate popover (in a portal),
			// so onFocusOutside fails to detect that a click on a suggestion occurred in the
			// LinkContainer. Detect clicks on autocomplete suggestions using a ref here, and
			// return to avoid the popover being closed.
			const autocompleteElement = autocompleteRef.current;
			// The focus event targets a DOM node.
			if (
				autocompleteElement &&
				autocompleteElement.contains( event.target as Node )
			) {
				return;
			}
			setIsOpen( false );
			setUrlInput( null );
			stopEditLink();
		};
	};

	const onSubmitLinkChange = () => {
		return ( event: FormEvent ) => {
			if ( urlInput ) {
				// It is possible the entered URL actually matches a named link destination.
				// This check will ensure our link destination is correct.
				const selectedDestination = getImageLinkDestination(
					urlInput,
					linkDestinations
				);

				onChangeUrl( {
					href: prependHTTPS( urlInput ),
					linkDestination: selectedDestination,
					lightbox: { enabled: false },
				} );
			}
			stopEditLink();
			setUrlInput( null );
			event.preventDefault();
		};
	};

	const onLinkRemove = () => {
		onChangeUrl( {
			linkDestination: LINK_DESTINATION_NONE,
			href: '',
		} );
	};

	const onSetHref = ( value?: string ) => {
		onChangeUrl( {
			linkDestination: getImageLinkDestination( value, linkDestinations ),
			href: value,
		} );
	};

	const onSetNewTab = ( value: boolean ) => {
		const updatedLinkTarget = getImageLinkTargetSettings( value, rel );
		onChangeUrl( updatedLinkTarget );
	};

	const onSetLinkRel = ( value: string ) => {
		onChangeUrl( { rel: value } );
	};

	const onSetLinkClass = ( value: string ) => {
		onChangeUrl( { linkClass: value } );
	};

	const advancedOptions = (
		<VStack spacing="3">
			<ToggleControl
				label={ __( 'Open in new tab' ) }
				onChange={ onSetNewTab }
				checked={ linkTarget === '_blank' }
			/>
			<TextControl
				label={ __( 'Link relation' ) }
				value={ rel ?? '' }
				onChange={ onSetLinkRel }
				help={ createInterpolateElement(
					__(
						'The <a>Link Relation</a> attribute defines the relationship between a linked resource and the current document.'
					),
					{
						a: (
							// @ts-expect-error `createInterpolateElement` fills in the children.
							<ExternalLink href="https://developer.mozilla.org/docs/Web/HTML/Attributes/rel" />
						),
					}
				) }
			/>
			<TextControl
				label={ __( 'Link CSS class' ) }
				value={ linkClass || '' }
				onChange={ onSetLinkClass }
			/>
		</VStack>
	);

	const linkEditorValue = urlInput !== null ? urlInput : url;
	const hideLightboxPanel =
		! lightboxEnabled || ( lightboxEnabled && ! showLightboxSetting );
	const showLinkEditor = ! linkEditorValue && hideLightboxPanel;

	const urlLabel = linkDestinations.find(
		( destination ) => destination.linkDestination === linkDestination
	)?.title;

	const PopoverChildren = (): ReactNode => {
		if (
			lightboxEnabled &&
			showLightboxSetting &&
			! url &&
			! isEditingLink
		) {
			return (
				<div className="block-editor-url-popover__expand-on-click">
					<Icon icon={ fullscreen } />
					<div className="text">
						<p>{ __( 'Enlarge on click' ) }</p>
						<p className="description">
							{ __( 'Scales the image with a lightbox effect' ) }
						</p>
					</div>
					<Button
						icon={ linkOff }
						label={ __( 'Disable enlarge on click' ) }
						onClick={ () => {
							onSetLightbox?.( false );
						} }
						size="compact"
					/>
				</div>
			);
		} else if ( ! url || isEditingLink ) {
			return (
				<URLPopover.LinkEditor
					className="block-editor-url-popover__link-container-content"
					value={ linkEditorValue }
					onChangeInputValue={ setUrlInput }
					onSubmit={ onSubmitLinkChange() }
					autocompleteRef={ autocompleteRef }
				/>
			);
		} else if ( url && ! isEditingLink ) {
			return (
				<>
					<URLPopover.LinkViewer
						className="block-editor-url-popover__link-container-content"
						url={ url }
						onEditLinkClick={ startEditLink }
						urlLabel={ urlLabel }
					/>
					<Button
						icon={ linkOff }
						label={ __( 'Remove link' ) }
						onClick={ () => {
							onLinkRemove();
							resetLightbox?.();
						} }
						size="compact"
					/>
				</>
			);
		}
		return undefined;
	};

	return (
		<>
			<ToolbarButton
				icon={ linkIcon }
				className="components-toolbar__control"
				label={ __( 'Link' ) }
				aria-expanded={ isOpen }
				onClick={ openLinkUI }
				ref={ setPopoverAnchor }
				isActive={
					!! url || ( lightboxEnabled && showLightboxSetting )
				}
			/>
			{ isOpen && (
				<URLPopover
					// The popover sets the ref before the effect reads it.
					ref={ wrapperRef as RefObject< HTMLDivElement > }
					anchor={ popoverAnchor }
					onFocusOutside={ onFocusOutside() }
					onClose={ closeLinkUI }
					renderSettings={
						hideLightboxPanel ? () => advancedOptions : null
					}
					additionalControls={
						showLinkEditor && (
							<NavigableMenu>
								{ linkDestinations.map( ( link ) => (
									<MenuItem
										key={ link.linkDestination }
										icon={ link.icon }
										iconPosition="left"
										onClick={ () => {
											setUrlInput( null );
											onSetHref( link.url );
											stopEditLink();
										} }
									>
										{ link.title }
									</MenuItem>
								) ) }
								{ showLightboxSetting && (
									<MenuItem
										key="expand-on-click"
										className="block-editor-url-popover__expand-on-click"
										icon={ fullscreen }
										info={ __(
											'Scale the image with a lightbox effect.'
										) }
										iconPosition="left"
										onClick={ () => {
											setUrlInput( null );
											onChangeUrl( {
												linkDestination:
													LINK_DESTINATION_NONE,
												href: '',
											} );
											onSetLightbox?.( true );
											stopEditLink();
										} }
									>
										{ __( 'Enlarge on click' ) }
									</MenuItem>
								) }
							</NavigableMenu>
						)
					}
					offset={ 13 }
				>
					{ PopoverChildren() }
				</URLPopover>
			) }
		</>
	);
};

export { ImageURLInputUI as __experimentalImageURLInputUI };
