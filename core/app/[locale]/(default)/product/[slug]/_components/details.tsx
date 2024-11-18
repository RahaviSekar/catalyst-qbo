import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { useFormatter, useTranslations } from 'next-intl';

import { PricingFragment } from '~/client/fragments/pricing';
import { ProductItemFragment } from '~/client/fragments/product-item';
import { FragmentOf, graphql } from '~/client/graphql';

import { ProductForm } from './product-form';
import { ProductFormFragment } from './product-form/fragment';
import { ProductSchema, ProductSchemaFragment } from './product-schema';
import { ReviewSummary, ReviewSummaryFragment } from './review-summary';
import TabComponnet from '../_components/tab';
import { log } from 'console';
import { GetCurrencyList } from '~/components/ui/header/currency';
import { CurrencyTextWrapper } from './exclvat';





export const DetailsFragment = graphql(
  `
    fragment DetailsFragment on Product {
      ...ReviewSummaryFragment
      ...ProductSchemaFragment
      ...ProductFormFragment
      ...ProductItemFragment
      entityId
      name
      sku
      upc
      minPurchaseQuantity
      maxPurchaseQuantity
      condition
      weight {
        value
        unit
      }
      availabilityV2 {
        description
      }
      customFields {
        edges {
          node {
            entityId
            name
            value
          }
        }
      }
      brand {
        name
      }
      ...PricingFragment
    }
  `,
  [
    ReviewSummaryFragment,
    ProductSchemaFragment,
    ProductFormFragment,
    ProductItemFragment,
    PricingFragment,
  ],
);


interface Props {
  product: FragmentOf<typeof DetailsFragment>;
}

export const Details = ({ product }: Props) => {
  const t = useTranslations('Product.Details');
  const format = useFormatter();

  const customFields = removeEdgesAndNodes(product.customFields);

  const showPriceRange =
    product.prices?.priceRange.min.value !== product.prices?.priceRange.max.value;

  return (
    <div>
      {product.brand && (
        <p className="mb-2 font-semibold uppercase text-gray-500 pdpbrand">{product.brand.name}</p>
      )}

      <h1 className="mb-4 text-4xl font-black lg:text-5xll pdpprname">{product.name}</h1>

      {Boolean(product.sku) && (
        <div className="pq productView-info">
          <h3 className="font-semibold flex productView-info-name">{t('sku')} <p className="pr productView-info-value ">: {product.sku}</p></h3>
        </div>
      )}


      {Boolean(product.availabilityV2.description) && (

        <div>
          <h3 className="font-semibold flex productView-info-name">{t('availability')} <p className="pr productView-info-value ">: {product.availabilityV2.description}</p></h3>

        </div>

      )}
      {Boolean(product.weight) && (
        <div>
          <h3 className="font-semibold flex productView-info-name">Bulk Pricing  <p className="pr productView-info-value ">:
            <a href="https://www.qualitybearingsonline.com/bulk-pricing/" onClick="event.stopPropagation();">Click Here to Enquire</a>
          </p></h3>

        </div>
      )}

      
      {product.prices && (
        <div className="my-6 text-2xl font-bold lg:text-3xl .productView-price .price--main">
          {showPriceRange ? (
            <span className=' .productView-price .price--main'>

              {format.number(product.prices.priceRange.min.value, {
                style: 'currency',
                currency: product.prices.price.currencyCode,
              })}{' '}
              -{' '}
              {format.number(product.prices.priceRange.max.value, {
                style: 'currency',
                currency: product.prices.price.currencyCode,
              })}
            </span>
          ) : (
            <>
              {product.prices.retailPrice?.value !== undefined && (
                <span>
                  {t('Prices.msrp')}:{' '}
                  <span className="line-through">
                    {format.number(product.prices.retailPrice.value, {
                      style: 'currency',
                      currency: product.prices.price.currencyCode,
                    })}
                  </span>
                  <br />
                </span>
              )}
              {product.prices.salePrice?.value !== undefined &&
                product.prices.basePrice?.value !== undefined ? (
                <>
                  <span>
                    {t('Prices.was')}:{' '}
                    <span className="line-through">
                      {format.number(product.prices.basePrice.value, {
                        style: 'currency',
                        currency: product.prices.price.currencyCode,
                      })}
                    </span>
                  </span>
                  <br />
                  <span className=' .productView-price .price--main'>
                    {t('Prices.now')}:{' '}
                    {format.number(product.prices.price.value, {
                      style: 'currency',
                      currency: product.prices.price.currencyCode,
                    })}
                  </span>
                </>
              ) : (
                product.prices.price.value && (
                  <>
                  <span className='.productView-price .price--main'>

                    {format.number(product.prices.price.value, {
                      style: 'currency',
                      currency: product.prices.price.currencyCode,

                    })}


                  </span>
                  
                  </>
                )
              )}
            </>
          )}
        </div>
      )}
{/* <GetCurrencyList /> */}
<CurrencyTextWrapper />
      <ProductForm data={product} />
      <div className="feefo-reviews">
        <img
          alt="Feefo logo"
          border="0"
          src={`https://api.feefo.com/api/logo?merchantidentifier=quality-bearings-online&vendorref=${product.sku}&servicedefault=true`}
          title="Our Feefo product rating"
        />
      </div>


      <div className="product-payments flex">
        <article className="product-payment">
          <svg xmlns="http://www.w3.org/2000/svg" width="49" height="32" viewBox="0 0 49 32"><path d="M14.06 10.283h4.24l-6.303 15.472-4.236.003-3.258-12.33c2.318.953 4.38 3.023 5.22 5.276l.42 2.148zm3.356 15.488l2.503-15.5h4l-2.503 15.5h-4.002zm14.576-9.276c2.31 1.106 3.375 2.444 3.362 4.21C35.322 23.923 32.59 26 28.384 26c-1.796-.02-3.526-.394-4.46-.826l.56-3.47.516.247c1.316.58 2.167.815 3.77.815 1.15 0  2.384-.476 2.395-1.514.007-.678-.517-1.164-2.077-1.923-1.518-.74-3.53-1.983-3.505-4.21.024-3.013 2.81-5.117 6.765-5.117 1.55 0 2.795.34 3.586.65l-.542 3.36-.36-.177c-.74-.314-1.686-.617-2.994-.595-1.568 0-2.293.69-2.293 1.333-.01.73.848 1.205 2.246 1.924zm14.207-6.21l3.238 15.49h-3.714s-.368-1.78-.488-2.32c-.583 0-4.667-.01-5.125-.01-.155.42-.84 2.332-.84 2.332h-4.205L41.01 11.57c.418-1.01 1.137-1.284 2.096-1.284H46.2zm-4.937 9.99h3.322l-.927-4.474-.27-1.337c-.202.58-.554 1.52-.53 1.48 0 0-1.263 3.44-1.595 4.33zm-31.54-1.572C8.075 14.13 4.44 11.712 0 10.592l.053-.32h6.453c.87.033 1.573.325 1.815 1.307z"></path></svg>
        </article>
        <article className="product-payment">
          <svg xmlns="http://www.w3.org/2000/svg" width="54" height="32" viewBox="0 0 54 32"><path d="M48.366 15.193c.6 0 .9.437.9 1.282 0 1.28-.546 2.21-1.337 2.21-.6 0-.9-.437-.9-1.31 0-1.282.572-2.183 1.336-2.183zm-10.09 3.082c0-.655.49-1.01 1.472-1.01.11 0 .19.028.382.028-.027.982-.545 1.636-1.227 1.636-.382 0-.628-.246-.628-.656zm-11.998-2.427v.327h-1.91c.165-.763.546-1.173 1.092-1.173.518 0 .818.3.818.845zM38.06.002c8.838 0 16.003 7.165 16.003 16.002s-7.165 16-16.003 16c-3.834 0-7.324-1.345-10.08-3.595 2.102-2.032 3.707-4.568 4.568-7.44h-1.33c-.833 2.552-2.297 4.806-4.2 6.626-1.89-1.816-3.34-4.078-4.17-6.62h-1.33c.857 2.856 2.434 5.4 4.52 7.432-2.75 2.22-6.223 3.594-10.036 3.594C7.165 32.002 0 24.84 0 16.002s7.164-16 16.002-16c3.814 0 7.287 1.377 10.036 3.603-2.087 2.023-3.664 4.568-4.52 7.424h1.33c.83-2.543 2.28-4.805 4.17-6.608 1.904 1.808 3.368 4.06 4.2 6.614h1.33c-.86-2.872-2.466-5.413-4.568-7.443C30.737 1.343 34.226 0 38.06 0zM7.217 20.212h1.69l1.337-8.043H7.572l-1.637 4.99-.082-4.99H3.4l-1.337 8.043h1.582l1.037-6.135.136 6.135H5.99l2.21-6.19zm7.253-.735l.054-.408.382-2.32c.11-.735.136-.98.136-1.308 0-1.254-.79-1.91-2.263-1.91-.628 0-1.2.083-2.046.328l-.246 1.473.163-.028.247-.08c.382-.11.928-.165 1.418-.165.79 0 1.09.164 1.09.6 0 .11 0 .19-.054.41-.272-.028-.517-.055-.708-.055-1.91 0-3 .927-3 2.536 0 1.065.628 1.774 1.555 1.774.79 0 1.364-.246 1.8-.79l-.027.68h1.418l.027-.163.027-.245zm3.518-3.163c-.736-.327-.82-.41-.82-.71 0-.354.3-.518.846-.518.328 0 .79.028 1.227.082l.247-1.5c-.436-.082-1.118-.137-1.5-.137-1.91 0-2.59 1.01-2.563 2.21 0 .817.382 1.39 1.282 1.827.71.327.818.436.818.71 0 .408-.3.6-.982.6-.518 0-.982-.083-1.527-.246l-.246 1.5.08.028.3.054c.11.027.247.055.465.055.382.054.71.054.928.054 1.8 0 2.645-.68 2.645-2.18 0-.9-.354-1.418-1.2-1.828zm3.762 2.427c-.41 0-.573-.135-.573-.463 0-.082 0-.164.027-.273l.463-2.726h.873l.218-1.61h-.873l.19-.98h-1.69l-.737 4.47-.082.52-.11.653c-.026.192-.054.41-.054.574 0 .954.49 1.445 1.364 1.445.382 0 .764-.056 1.227-.22l.218-1.444c-.108.054-.272.054-.463.054zm3.982.11c-.982 0-1.5-.38-1.5-1.144 0-.055 0-.11.027-.19h3.38c.164-.683.22-1.146.22-1.637 0-1.447-.9-2.374-2.32-2.374-1.717 0-2.972 1.663-2.972 3.9 0 1.935.982 2.944 2.89 2.944.628 0 1.173-.082 1.773-.273l.274-1.636c-.6.3-1.145.41-1.773.41zm5.426-3.326h.11c.163-.79.38-1.363.654-1.88l-.055-.028h-.164c-.573 0-.9.273-1.418 1.064l.164-1.01h-1.555l-1.064 6.545h1.72c.626-4.008.79-4.69 1.608-4.69zm4.964 4.61l.3-1.828c-.545.273-1.036.41-1.445.41-1.01 0-1.61-.738-1.61-1.964 0-1.773.9-3.027 2.183-3.027.49 0 .928.136 1.528.436l.3-1.744c-.163-.054-.218-.082-.436-.163l-.682-.164c-.218-.055-.49-.083-.79-.083-2.264 0-3.846 2.018-3.846 4.88 0 2.155 1.146 3.49 3 3.49.463 0 .872-.08 1.5-.245zm5.4-1.065l.354-2.32c.136-.735.136-.98.136-1.308 0-1.254-.763-1.91-2.236-1.91-.627 0-1.2.083-2.045.328l-.245 1.473.164-.028.217-.08c.382-.11.955-.165 1.446-.165.79 0 1.09.164 1.09.6 0 .11-.026.19-.08.41-.247-.028-.492-.055-.683-.055-1.91 0-3 .927-3 2.536 0 1.065.627 1.774 1.555 1.774.79 0 1.363-.246 1.8-.79l-.028.68h1.418v-.163l.027-.245.054-.327zm2.126 1.144c.627-4.008.79-4.69 1.608-4.69h.11c.163-.79.38-1.363.654-1.88l-.055-.028H45.8c-.57 0-.9.273-1.417 1.064l.164-1.01h-1.554l-1.037 6.545h1.69zm5.18 0h1.61l1.308-8.044h-1.69l-.383 2.29c-.464-.6-.955-.9-1.637-.9-1.5 0-2.782 1.855-2.782 4.036 0 1.636.818 2.7 2.073 2.7.627 0 1.118-.218 1.582-.71zM11.307 18.28c0-.656.492-1.01 1.447-1.01.136 0 .218.027.382.027-.027.982-.518 1.636-1.228 1.636-.382 0-.6-.245-.6-.655z"></path></svg>
        </article>
        <article className="product-payment">
          <svg xmlns="http://www.w3.org/2000/svg" width="70" height="32" viewBox="0 0 70 32"><path d="M69.102 17.22l.4 9.093c-.69.313-3.286 1.688-4.26 1.688h-4.79v-.655c-.545.438-1.548.656-2.466.656H42.933v-2.465c0-.344-.057-.344-.345-.344h-.257V28h-4.96v-2.923c-.832.402-1.75.402-2.58.402h-.545V28h-6.05l-1.434-1.656-1.576 1.656h-9.72v-10.78h9.892l1.405 1.662 1.55-1.663h6.65c.776 0 2.038.116 2.582.66v-.66h5.936c.602 0 1.75.116 2.523.66v-.66h8.947v.66c.516-.43 1.433-.66 2.265-.66H62.2v.66c.546-.37 1.32-.66 2.323-.66H69.1zm-34.197 6.65c1.577 0 3.183-.43 3.183-2.58 0-2.093-1.635-2.523-3.07-2.523h-5.877l-2.38 2.523-2.235-2.523h-7.427v7.67h7.312l2.35-2.51 2.267 2.51h3.556V23.87h2.322zM46 23.557c-.17-.23-.486-.516-.945-.66.516-.172 1.318-.832 1.318-2.036 0-.89-.315-1.377-.917-1.72-.602-.316-1.32-.373-2.266-.373h-4.215v7.67h1.864V23.64h1.977c.66 0 1.032.06 1.32.345.315.373.315 1.032.315 1.548v.903h1.836V24.96c0-.69-.058-1.033-.288-1.406zm7.57-3.183v-1.605h-6.135v7.67h6.136v-1.563h-4.33v-1.55h4.245V21.78H49.24v-1.405h4.33zm4.675 6.065c1.864 0 2.926-.76 2.926-2.393 0-.774-.23-1.262-.544-1.664-.46-.37-1.12-.6-2.15-.6H57.47c-.257 0-.486-.058-.716-.116-.2-.086-.373-.258-.373-.545 0-.26.06-.43.288-.603.143-.115.373-.115.717-.115h3.383v-1.634h-3.67c-1.98 0-2.64 1.204-2.64 2.294 0 2.438 2.152 2.322 3.843 2.38.345 0 .545.058.66.173.116.086.23.315.23.544 0 .2-.114.372-.23.487-.172.115-.372.172-.716.172H54.69v1.62h3.554zm7.197 0c1.864 0 2.924-.76 2.924-2.393 0-.774-.23-1.262-.544-1.664-.46-.37-1.12-.6-2.15-.6h-1.004c-.258 0-.488-.058-.718-.116-.2-.086-.373-.258-.373-.545 0-.26.115-.43.287-.603.144-.115.373-.115.717-.115h3.384v-1.634h-3.67c-1.922 0-2.64 1.204-2.64 2.294 0 2.438 2.152 2.322 3.843 2.38.344 0 .544.058.66.174.115.086.23.315.23.544 0 .2-.115.373-.23.488s-.373.172-.717.172h-3.556v1.62h3.556zm-21.476-5.92c.23.115.373.344.373.66 0 .343-.144.6-.374.773-.287.116-.545.116-.89.116l-2.236.058v-1.75h2.237c.344 0 .66 0 .89.144zM36.108 8.646c-.287.172-.544.172-.918.172h-2.265V7.126h2.265c.316 0 .688 0 .918.114.23.144.344.374.344.718 0 .315-.114.602-.344.69zm14.68-1.807l1.263 3.038H49.53zM30.776 25.79l-2.838-3.183 2.838-3.012v6.193zm4.244-5.42c.66 0 1.09.26 1.09.92s-.43 1.03-1.09 1.03H32.58v-1.95h2.437zM5.772 9.88l1.29-3.04 1.263 3.04H5.774zm13.132 10.494h4.616l2.037 2.237-2.093 2.264h-4.56v-1.55h4.072v-1.547h-4.07v-1.405zm.172-6.996l-.545 1.377h-3.24l-.546-1.32v1.32H8.524l-.66-1.75H6.287l-.717 1.75H-.002l2.39-5.65L4.623 4h4.79l.658 1.262V4h5.59l1.263 2.724L18.158 4h17.835c.832 0 1.548.143 2.093.602V4h4.903v.602C43.79 4.142 44.852 4 46.056 4h7.082l.66 1.262V4h5.217l.775 1.262V4h5.103v10.753h-5.16l-1.004-1.635v1.635H52.31l-.717-1.75h-1.576l-.717 1.75h-3.355c-1.318 0-2.294-.316-2.954-.66v.66h-7.97v-2.466c0-.344-.058-.402-.287-.402h-.257v2.867H19.075v-1.377zM43.363 6.41c-.832.83-.975 1.863-1.004 3.01 0 1.377.343 2.266.946 2.925.66.66 1.806.86 2.695.86h2.152l.716-1.692h3.843l.718 1.692h3.727V7.442l3.47 5.763h2.638V5.52H61.37v5.334L58.13 5.52h-2.838v7.255L52.196 5.52h-2.724l-2.638 6.05h-.832c-.487 0-1.003-.114-1.262-.372-.344-.402-.488-1.004-.488-1.836 0-.803.144-1.405.488-1.748.373-.316.774-.43 1.434-.43h1.75V5.52h-1.75c-1.262 0-2.265.286-2.81.89zm-3.784-.89v7.684h1.862V5.52H39.58zm-8.46 0v7.685h1.806v-2.78h1.98c.66 0 1.09.056 1.375.314.317.4.26 1.06.26 1.49v.975h1.89v-1.52c0-.66-.056-1.003-.343-1.376-.172-.23-.487-.49-.89-.66.517-.23 1.32-.832 1.32-2.036 0-.89-.373-1.377-.976-1.75-.6-.344-1.26-.344-2.207-.344h-4.215zm-7.484 0v7.686H29.8V11.63h-4.3v-1.55h4.244V8.503H25.5V7.126h4.3V5.52h-6.164zm-7.512 7.685H17.7l2.696-6.02v6.02h1.864V5.52h-3.01l-2.266 5.22-2.41-5.22h-2.952v7.255L8.468 5.52H5.744l-3.297 7.685h1.978l.688-1.692h3.87l.69 1.692h3.755v-6.02z"></path></svg>
        </article>
        <article className="product-payment">
          <svg xmlns="http://www.w3.org/2000/svg" width="57" height="32" viewBox="0 0 57 32"><path d="M47.11 10.477c2.21-.037 4.633.618 4.072 3.276l-1.37 6.263h-3.158l.21-.947c-1.72 1.71-6.037 1.82-5.334-2.112.49-2.294 2.878-3.023 6.423-3.023.246-1.02-.457-1.274-1.65-1.238s-2.633.437-3.09.655l.282-2.293c.913-.183 2.106-.584 3.615-.584zm.21 6.408c.07-.29.106-.547.176-.838h-.773c-.596 0-1.58.146-1.93.765-.457.728.176 1.348.877 1.31.807-.036 1.474-.4 1.65-1.237zM53.883 8h3.242L54.48 20.016h-3.21zm-14.74.037c1.688 0 3.728 1.274 3.13 4.077-.528 2.476-2.498 3.933-4.89 3.933h-2.428l-.88 3.97h-3.41l2.602-11.98h5.874zm-.106 4.077c.21-.91-.317-1.638-1.197-1.638h-1.69l-.703 3.277h1.583c.88 0 1.795-.728 2.006-1.638zm-22.69-1.638c2.183-.037 4.61.618 4.055 3.276l-1.352 6.262h-3.155l.208-.947c-1.664 1.712-5.93 1.82-5.235-2.11.486-2.295 2.844-3.024 6.345-3.024.208-1.02-.485-1.274-1.664-1.238s-2.602.437-3.018.655l.277-2.293c.866-.182 2.045-.583 3.536-.583zm.242 6.41c.034-.292.103-.548.172-.84h-.797c-.555 0-1.525.147-1.872.766-.45.728.138 1.348.832 1.31.797-.036 1.49-.4 1.664-1.237zm11.938-6.238h3.255l-7.496 13.35H20.76l2.305-3.924-1.29-9.426h3.157l.508 5.58zM8.498 8.036c1.73 0 3.74 1.274 3.14 4.077-.53 2.476-2.504 3.933-4.867 3.933H4.304l-.847 3.97H0l2.61-11.98H8.5zm-.105 4.078c.247-.91-.317-1.638-1.164-1.638H5.535l-.74 3.277h1.622c.882 0 1.763-.728 1.975-1.638z"></path></svg>
        </article>
      </div>


      <ProductSchema product={product} />
    </div>
  );
};






