import React from 'react';
import {
  RichText as JssRichText,
  useSitecoreContext,
  RichTextField,
  GetStaticComponentProps,
  ComponentRendering,
  useComponentProps,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { GraphQLRequestClient } from '@sitecore-jss/sitecore-jss-nextjs/graphql';
import config from 'temp/config';

interface Fields {
  Content: RichTextField;
}

type PageContentProps = {
  rendering: ComponentRendering;
  params: { [key: string]: string };
  fields: Fields;
};

type ComponentContentProps = {
  id: string;
  styles: string;
  children: JSX.Element;
};

const ComponentContent = (props: ComponentContentProps) => {
  const id = props.id;
  return (
    <div className={`component content ${props.styles}`} id={id ? id : undefined}>
      <div className="component-content">
        <div className="field-content">{props.children}</div>
      </div>
    </div>
  );
};

export const Default = (props: PageContentProps): JSX.Element => {
  const { sitecoreContext } = useSitecoreContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { externalData } = useComponentProps<any>(props.rendering.uid);
  const id = props.params.RenderingIdentifier;

  console.log(externalData);

  if (!(props.fields && props.fields.Content) && !sitecoreContext?.route?.fields?.Content) {
    return (
      <div className={`component content ${props.params.styles}`} id={id ? id : undefined}>
        <div className="component-content">
          <div className="field-content">[Content]</div>
        </div>
      </div>
    );
  }

  const field = (
    props.fields && props.fields.Content
      ? props.fields.Content
      : sitecoreContext?.route?.fields?.Content
  ) as RichTextField;

  return (
    <ComponentContent styles={props.params.styles} id={id}>
      <JssRichText field={field} />
    </ComponentContent>
  );
};

export const getStaticProps: GetStaticComponentProps = async () => {
  const graphQLClient = new GraphQLRequestClient(config.graphQLEndpoint);

  const result = await graphQLClient.request(`query {
  item(path:"/sitecore/content/codespaces3/codespaces3/Home", language: "en") {
    name
    displayName
    fields {
      name
      jsonValue
    } 
  }
}
  `);

  return result;
};
