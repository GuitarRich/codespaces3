import React, { useEffect, useState } from 'react';
import {
  Image as JssImage,
  Link as JssLink,
  ImageField,
  Field,
  LinkField,
  Text,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';

interface Fields {
  Image: ImageField;
  ImageCaption: Field<string>;
  TargetUrl: LinkField;
}

type ImageProps = {
  params: { [key: string]: string };
  fields: Fields;
};

const ImageDefault = (props: ImageProps): JSX.Element => (
  <div className={`component image ${props.params.styles}`.trimEnd()}>
    <div className="component-content">
      <span className="is-empty-hint">Image</span>
    </div>
  </div>
);

const NotSVGImage = (props: ImageProps, pageState: string): JSX.Element => {
  const Image = () => <JssImage field={props.fields.Image} />;
  const id = props.params.RenderingIdentifier;

  return (
    <div className={`component image ${props.params.styles}`} id={id ? id : undefined}>
      <div className="component-content">
        {pageState === 'edit' || !props.fields.TargetUrl?.value?.href ? (
          <Image />
        ) : (
          <JssLink field={props.fields.TargetUrl}>
            <Image />
          </JssLink>
        )}
        <Text
          tag="span"
          className="image-caption field-imagecaption"
          field={props.fields.ImageCaption}
        />
      </div>
    </div>
  );
};

const SVGImage = (props: ImageProps): JSX.Element => {
  const svgPath = props.fields?.Image.value?.src ? props.fields?.Image.value?.src : '';

  const [svgData, setSVGData] = useState({});

  useEffect(() => {
    if (svgPath) {
      const path = './-/media/' + svgPath.split('-/media')[1];
      console.log('svgPath: ', path);
      const data = async () => {
        const Data = (await import('axios')).default;
        Data.get(path).then((response) => {
          const svg = response.data;
          setSVGData(svg);
        });
      };
      data();
    }
  }, [svgPath]); // Add closing parenthesis and semicolon here

  return <div dangerouslySetInnerHTML={{ __html: svgData }} />;
};

export const Banner = (props: ImageProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  const isPageEditing = sitecoreContext.pageEditing;
  const classHeroBannerEmpty =
    isPageEditing && props.fields?.Image?.value?.class === 'scEmptyImage'
      ? 'hero-banner-empty'
      : '';
  const backgroundStyle = { backgroundImage: `url('${props?.fields?.Image?.value?.src}')` };
  const modifyImageProps = {
    ...props.fields.Image,
    editable: props?.fields?.Image?.editable
      ?.replace(`width="${props?.fields?.Image?.value?.width}"`, 'width="100%"')
      .replace(`height="${props?.fields?.Image?.value?.height}"`, 'height="100%"'),
  };
  const id = props.params.RenderingIdentifier;

  return (
    <div
      className={`component hero-banner ${props.params.styles} ${classHeroBannerEmpty}`}
      id={id ? id : undefined}
    >
      <div className="component-content sc-sxa-image-hero-banner" style={backgroundStyle}>
        {sitecoreContext.pageEditing ? <JssImage field={modifyImageProps} /> : ''}
      </div>
    </div>
  );
};

export const Default = (props: ImageProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();

  if (props.fields) {
    if (sitecoreContext.pageEditing) {
      return <NotSVGImage {...props} />;
    } else {
      if (props.fields?.Image.value?.src?.includes('.svg')) {
        return (
          <>
            Test SVG Image
            <br />
            <div style={{ border: '1px solid red', display: 'block', width: '100%' }}>
              <SVGImage {...props} />
            </div>
          </>
        );
      }

      return <NotSVGImage {...props} />;
    }
  }

  return <ImageDefault {...props} />;
};
