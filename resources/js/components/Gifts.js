import React, { useState, useCallback, useEffect } from 'react';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { Page, LegacyCard, ResourceList, ResourceItem, Thumbnail, Text, ButtonGroup, Button, Form, FormLayout, TextField, Select, Toast } from '@shopify/polaris';
import callapi from './CallApi';

const Gifts = () => {
    const [myState, setMyState] = useState({
        productModalIsShowed: false,
        pickerOpen: false,
        giftPending: false
    });
    const [toast,setToast] = useState({
        message: '',
        active: false,
        error: false
    })
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [gifts, setGifts] = useState([]);
    const toggleActive = useCallback(() => {
        setToast(!toast.active);
    }, []);
    const toastMarkup = toast.active ? (
        <Toast error={toast.error} content={toast.message} onDismiss={toggleActive} />
    ) : null;

    useEffect(() => {
        fetchGifts();
    }, []);
    const fetchGifts = async () => {
        callapi(window.App.appUrl + '/api/gifts')
            .then((response) => {
                setGifts(response.data);
            })
    };
    
    const deleteGift = (product_id) => {
        if (confirm("Are you sure you want to delete?")) {
            callapi(window.App.appUrl + '/api/deleteGift', {
                product_id: product_id
            })
            .then((response) => {
                if(response.data.status){
                    fetchGifts();
                    setToast({
                        message: 'Gift deleted',
                        active: true,
                        error: false
                    })
                }else{
                    setToast({
                        message: response.data.message,
                        active: true,
                        error: true
                    })
                }
            })
        }
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
        changeState('giftPending',true)
        let data = selectedProduct;
        if (selectedVariant == null) {
            data.variant_id = null
        } else {
            data.variant_id = data.variants.find(x => x.value == selectedVariant).value;
        }
        callapi(window.App.appUrl + '/api/addGift', data)
        .then((response) => {
            if(response.data.status){
                setToast({
                    message: 'Create gift successful',
                    active: true,
                    error: false
                })
                // Clear gift selected
                setSelectedProduct(null);
                fetchGifts();
                changeState('giftPending',false)
            }else{
                setToast({
                    message: 'Create gift not successful',
                    active: true,
                    error: true
                })
                changeState('giftPending',false)
            }
        })
    }

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
                                        <Button primary disabled={myState.giftPending} loading={myState.giftPending}
                                            submit>Create Gift</Button>
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
                                const { id, product_id,product_image, product_title, variant_title } = item;
                                const media = <Thumbnail source={product_image} alt={product_title} size="small" />;
                                return (
                                    <ResourceItem
                                        id={id}
                                        media={media}
                                        accessibilityLabel={`View details for ${product_image}`}
                                    >

                                        <div className='Polaris-Inline-Item'>
                                            <div className='Polaris-Inline-Title'>
                                                <Text variant="bodyMd" fontWeight="bold" as="h3">
                                                    {product_title}
                                                </Text>
                                                <div>{variant_title}</div>
                                            </div>
                                            <div className='Polaris-Inline-Action'>
                                                <ButtonGroup>
                                                    <Button onClick={() => deleteGift(product_id)} type="button" size="slim" destructive >Delete</Button>
                                                </ButtonGroup>
                                            </div>
                                        </div>
                                    </ResourceItem>
                                );
                            }}
                        />
                    </LegacyCard.Section>
                </LegacyCard>
                {toastMarkup}
            </Page>
        </div>
    );
};

export default Gifts;