import React, { useState } from 'react';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { Page, LegacyCard, ResourceList, ResourceItem, Thumbnail, Text, ButtonGroup, Button, Form, FormLayout, TextField, Select } from '@shopify/polaris';
import callapi from './CallApi';

const Gifts = () => {
    const [myState, setMyState] = useState({
        productModalIsShowed: false,
        pickerOpen: false,
    })
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const gifts = [
        {
            thumb: 'https://cdn.shopify.com/s/files/1/0655/6096/9461/products/Asset24_2x-281633-837784_f9362dd0-d65a-4e65-bafb-f79936ff832f.png?v=1679296752',
            title: 'Free Bike Box (Packaging Materials)',
            variant: 'Default'
        }
    ]
    const openProductModal = () => {
        changeState('pickerOpen', true)
    }
    const changeState = (field, value) => {
        setMyState({
            ...myState,
            [field]: value
        })
    }
    const chooseProduct = (payload) => {
        console.log(payload);
        let variants = payload.selection[0].variants.map(x => ({
            value: x.id.replace('gid://shopify/ProductVariant/', ''),
            label: x.title
        }))
        variants.unshift({
            value: 0,
            label: "Not Select"
        })
        let product = {
            id: payload.selection[0].id.replace('gid://shopify/Product/', ''),
            image: payload.selection[0].images[0].originalSrc,
            title: "Free " + payload.selection[0].title,
            variants: variants
        }
        setSelectedProduct(product)
        changeState('pickerOpen', false)
    }
    const changeGiftTitle = (value) =>{
        setSelectedProduct({
            ...selectedProduct,
            ['title']: value
        })
    }
    const addGift = () => {
        let data = selectedProduct;
        if(selectedVariant == null){
            data.variant_id = null
        }else{
            data.variant_id = data.variants.find(x => x.value == selectedVariant).value;
        }
        callapi(window.App.appUrl + '/api/addGift', data)
            .then((response) => {
            })
    }

    return (
        <div id="page-gifts">
            <Page
                title="Create and Manage Gifts"
            >
                <ResourcePicker
                    open={myState.pickerOpen}
                    resourceType="Product"
                    showVariants={false}
                    selectMultiple={false}
                    showHidden={true}
                    onCancel={() => {
                        changeState('pickerOpen', false)
                    }}
                    onSelection={(payload) => chooseProduct(payload)}
                />
                <LegacyCard sectioned title="Create a Gift" actions={[{ content: 'How Do We Create a Free Gift?' }]}>
                    <LegacyCard.Section>
                        <div className={'select-gift-product-section' + (selectedProduct == null ? ' not-selected' : '')}>
                            <div className='select-gift-product-section__image'>
                                <img src={selectedProduct != null ? selectedProduct.image : window.App.appUrl + "/images/empty-gift.png"} />
                            </div>
                            {selectedProduct != null ?
                                <div className='select-gift-product-section__title'>
                                    <Text variant="headingLg" as="h5">
                                        {selectedProduct != null ? selectedProduct.title : ''}
                                    </Text>
                                </div> :
                                <div className='select-gift-product-section__placeholder'>
                                    <Text as="span" color="subdued">Select a product to create a gift.</Text>
                                </div>}
                            <div className='select-gift-product-section__action'>
                                <Button onClick={openProductModal} primary>{selectedProduct == null ? 'Select a Product' : 'Select another Product'}</Button>
                            </div>
                        </div>
                    </LegacyCard.Section>
                    {selectedProduct ?
                        <LegacyCard.Section title="Custom Gift">
                            <FormLayout.Group>
                                <TextField
                                    label="The gift title"
                                    value={selectedProduct.title}
                                    onChange={(value) => changeGiftTitle(value)}
                                    autoComplete="off"
                                />
                                <Select
                                    label="Select a Variant"
                                    options={selectedProduct.variants}
                                    onChange={(value) => setSelectedVariant(value)}
                                    value={selectedVariant == null ? selectedProduct.variants[0] : selectedVariant}
                                />
                            </FormLayout.Group>
                            <FormLayout>
                                <ButtonGroup>
                                    {selectedProduct ? <Button onClick={() => setSelectedProduct(null)}>Cancel</Button> : ''}
                                    <Button primary onClick={addGift}>Create Gift</Button>
                                </ButtonGroup>
                            </FormLayout>
                        </LegacyCard.Section> : null}
                </LegacyCard>
                <LegacyCard title="Gift Products You've Created:">
                    <LegacyCard.Section>
                        <ResourceList
                            resourceName={{ singular: 'customer', plural: 'customers' }}
                            items={gifts}
                            renderItem={(item) => {
                                const { thumb, title, variant } = item;
                                const media = <Thumbnail source={thumb} alt={title} size="small" />;

                                return (
                                    <ResourceItem
                                        media={media}
                                        accessibilityLabel={`View details for ${thumb}`}
                                    >
                                        <div className='Polaris-Inline-Item'>
                                            <div className='Polaris-Inline-Title'>
                                                <Text variant="bodyMd" fontWeight="bold" as="h3">
                                                    {title}
                                                </Text>
                                                <div>{variant}</div>
                                            </div>
                                            <div className='Polaris-Inline-Action'>
                                                <ButtonGroup>
                                                    <Button size="slim">Edit</Button>
                                                    <Button size="slim" destructive>Delete</Button>
                                                </ButtonGroup>
                                            </div>
                                        </div>
                                    </ResourceItem>
                                );
                            }}
                        />
                    </LegacyCard.Section>
                </LegacyCard>
            </Page>
        </div>
    );
};

export default Gifts;