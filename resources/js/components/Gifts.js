import React, { useState, useCallback, useEffect } from 'react';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { Page, LegacyCard, ResourceList, ResourceItem, Thumbnail, Text, ButtonGroup, Button, Form, FormLayout, TextField, Select, Toast } from '@shopify/polaris';
import callapi from './CallApi';

const Gifts = () => {
    const [myState, setMyState] = useState({
        productModalIsShowed: false,
        pickerOpen: false,
    })
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGifts();
    }, []);
    const fetchGifts = async () => {
        
        try {
            const response = await fetch(window.App.appUrl + '/api/addGift');
            if (!response.ok) {
                throw response;
            }
            const data = await response.json();
            setGifts(data);
           
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    
    const deleteGift = (id) => {

    };


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
    const changeGiftTitle = (value) => {
        setSelectedProduct({
            ...selectedProduct,
            ['title']: value
        })
    }
    const addGift = () => {
        let data = selectedProduct;
        if (selectedVariant == null) {
            data.variant_id = null
        } else {
            data.variant_id = data.variants.find(x => x.value == selectedVariant).value;
        }
        callapi(window.App.appUrl + '/api/addGift', data)
            .then((response) => {
                console.log("successfully");
            })
    }
    const [active, setActive] = useState(false);
    const toggleActive = useCallback(() => setActive((active) => !active), []);
    const toastMarkup = active ? (
        <Toast content="Successfully" onDismiss={toggleActive} />
    ) : null;
    return (
        <div id="page-gifts">
            <Page title="Create and Manage Gifts">
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
                                    <Text variant="headingLg" as="h5" >
                                        {selectedProduct != null ? selectedProduct.title : ''}
                                    </Text>
                                </div> :
                                <div className='select-gift-product-section__placeholder'>
                                    <Text as="span" color="subdued">Select a product to create a gift.</Text>
                                </div>
                            }
                            <div className='select-gift-product-section__action'>
                                <Button onClick={openProductModal} primary>{selectedProduct == null ? 'Select a Product' : 'Select another Product'}</Button>
                            </div>
                        </div>
                    </LegacyCard.Section>
                    {selectedProduct ?
                        <LegacyCard.Section title="Custom Gift" >
                            <Form onSubmit={addGift}>
                                <FormLayout.Group >
                                    <TextField
                                        label="The gift title" name='title'
                                        value={selectedProduct.title}
                                        onChange={(value) => changeGiftTitle(value)}
                                        autoComplete="off"
                                    />
                                    <Select
                                        label="Select a Variant" name='variant'
                                        options={selectedProduct.variants}
                                        onChange={(value) => setSelectedVariant(value)}
                                        value={selectedVariant == null ? selectedProduct.variants[0] : selectedVariant}
                                    />
                                </FormLayout.Group>
                                <FormLayout>
                                    <ButtonGroup>
                                        {selectedProduct ? <Button onClick={() => setSelectedProduct(null)}>Cancel</Button> : ''}
                                        <Button primary onClick={toggleActive}
                                            submit>Create Gift</Button>
                                        {toastMarkup}
                                    </ButtonGroup>
                                </FormLayout>
                            </Form>
                        </LegacyCard.Section> : null}
                </LegacyCard>
                <LegacyCard title="Gift Products You've Created:">
                    <LegacyCard.Section>
                        <ResourceList
                            resourceName={{ singular: 'customer', plural: 'customers' }}
                            items={gifts}
                            renderItem={(item) => {
                                const { id, thumb, title, variant } = item;
                                const media = <Thumbnail source={thumb} alt={title} size="small" />;
                                return (
                                    <ResourceItem
                                        id={id}
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
                                                    <Button onClick={() => deleteGift(id)} type="button" size="slim" destructive >Delete</Button>
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