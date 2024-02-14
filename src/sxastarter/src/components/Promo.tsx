import React, { useEffect } from 'react';
import {
  Image as JssImage,
  Link as JssLink,
  RichText as JssRichText,
  ImageField,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { emitWarning } from 'process';

interface Fields {
  PromoIcon: ImageField;
  PromoText: Field<string>;
  PromoLink: LinkField;
  PromoText2: Field<string>;
}

type PromoProps = {
  params: { [key: string]: string };
  fields: Fields;
};

const PromoDefaultComponent = (props: PromoProps): JSX.Element => (
  <div className={`component promo ${props.params.styles}`}>
    <div className="component-content">
      <span className="is-empty-hint">Promo</span>
    </div>
  </div>
);

const TabItem = (props: { tabHeading: string }): JSX.Element => {
  useEffect(() => {
    console.log('TabItem component mounted', props.tabHeading);
    const event = new CustomEvent('onTabLoaded', { detail: { tabHeading: props.tabHeading } });
    document?.dispatchEvent(event);
  }, [props.tabHeading]);

  return (
    <div className="tab-item">
      <span>{props.tabHeading}</span>
    </div>
  );
};

export const Default = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const [activeTabPath, setActiveTabPath] = React.useState<string>('');
  const [tabHeadings, setTabHeadings] = React.useState<string[]>([]);

  useEffect(() => {
    console.log('Promo component mounted', props.params.RenderingId);
    document?.addEventListener('onTabLoaded', (e: CustomEvent) => {
      console.log('onTabLoaded event received', e.detail.tabHeading);
      const tabHeading = e.detail.tabHeading;
      setTabHeadings((prevTabHeadings) => [...prevTabHeadings, tabHeading]);
    });
  }, [props.params.RenderingId]);

  useEffect(() => {
    console.log('Promo component updated');
    setActiveTabPath('1');
  }, [activeTabPath, tabHeadings]);

  if (props.fields) {
    return (
      <div className={`component promo ${props.params.styles}`} id={id ? id : undefined}>
        <div className="component-content">
          <div className="field-promoicon">
            <TabItem tabHeading="Tab 1" />
            <TabItem tabHeading="Tab 2" />
            <JssImage field={props.fields.PromoIcon} />
          </div>
          <div className="promo-text">
            <div>
              <div className="field-promotext">
                <JssRichText field={props.fields.PromoText} />
              </div>
            </div>
            <div className="field-promolink">
              <JssLink field={props.fields.PromoLink} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <PromoDefaultComponent {...props} />;
};

export const WithText = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;

  if (props.fields) {
    return (
      <div className={`component promo ${props.params.styles}`} id={id ? id : undefined}>
        <div className="component-content">
          <div className="field-promoicon">
            <JssImage field={props.fields.PromoIcon} />
          </div>
          <div className="promo-text">
            <div>
              <div className="field-promotext">
                <JssRichText className="promo-text" field={props.fields.PromoText} />
              </div>
            </div>
            <div className="field-promotext">
              <JssRichText className="promo-text" field={props.fields.PromoText2} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <PromoDefaultComponent {...props} />;
};
