import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Upload, 
  Trash2, 
  Loader2, 
  Sparkles, 
  DollarSign, 
  Layers, 
  Tag, 
  Package, 
  FileText, 
  Image as ImageIcon 
} from 'lucide-react';
import { 
  useGetProductDetailsQuery, 
  useUpdateProductMutation, 
  useUploadProductImageMutation,
  useUploadMultipleProductImagesMutation
} from '../../slices/productsApiSlice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  const [colorsText, setColorsText] = useState('');
  const [sizesText, setSizesText] = useState('');

  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();
  const [uploadMultipleProductImages, { isLoading: loadingMultipleUpload }] = useUploadMultipleProductImagesMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setOriginalPrice(product.originalPrice || '');
      setImage(product.image);
      setImages(product.images || []);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setBadge(product.badge || '');
      setColorsText(product.colors ? product.colors.join(', ') : '');
      setSizesText(product.sizes ? product.sizes.join(', ') : '');
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        originalPrice: originalPrice === '' ? null : Number(originalPrice),
        image,
        images,
        brand,
        category,
        countInStock,
        description,
        badge,
        colors: colorsText ? colorsText.split(',').map((c) => c.trim()).filter((c) => c !== '') : [],
        sizes: sizesText ? sizesText.split(',').map((s) => s.trim()).filter((s) => s !== '') : [],
      }).unwrap();
      alert('Product updated successfully');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      console.error(err?.data?.message || err.error);
      alert(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      alert(res.message);
      setImage(res.image);
    } catch (err) {
      console.error(err?.data?.message || err.error);
      alert(err?.data?.message || err.error);
    }
  };

  const uploadMultipleFilesHandler = async (e) => {
    const formData = new FormData();
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    try {
      const res = await uploadMultipleProductImages(formData).unwrap();
      alert(res.message);
      setImages((prev) => [...prev, ...res.images]);
    } catch (err) {
      console.error(err?.data?.message || err.error);
      alert(err?.data?.message || err.error);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <div>
        <Button
          variant="ghost"
          asChild
          className="gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <Link to="/admin/productlist">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          Edit Product
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Modify the specifications, pricing, stock levels, and media assets for this catalog item
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-24 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse text-sm">Loading product details...</p>
        </div>
      ) : error ? (
        <Card className="border-destructive/30 bg-destructive/10">
          <CardContent className="flex items-center gap-3 p-6 text-destructive-foreground">
            <span className="font-semibold text-sm">Error:</span>
            <span className="text-sm">{error?.data?.message || error.error}</span>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* General Information Card */}
            <Card className="border-border/50 bg-card/30 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  General Information
                </CardTitle>
                <CardDescription>Basic info displayed to store visitors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="e.g. Modern Ergo Chair"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-muted/20 border border-border/80 rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="brand" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> Brand</span>
                    </label>
                    <input
                      type="text"
                      id="brand"
                      required
                      placeholder="e.g. NovaDecor"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full bg-muted/20 border border-border/80 rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      <span className="flex items-center gap-1"><Layers className="h-3 w-3" /> Category</span>
                    </label>
                    <input
                      type="text"
                      id="category"
                      required
                      placeholder="e.g. Furniture"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-muted/20 border border-border/80 rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="badge" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Product Badge (e.g. Sale, New, Best Seller)
                  </label>
                  <input
                    type="text"
                    id="badge"
                    placeholder="e.g. Sale"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full bg-muted/20 border border-border/80 rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="colors" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Colors (comma separated)
                    </label>
                    <input
                      type="text"
                      id="colors"
                      placeholder="Black, Silver, Space Gray"
                      value={colorsText}
                      onChange={(e) => setColorsText(e.target.value)}
                      className="w-full bg-muted/20 border border-border/80 rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="sizes" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Sizes (comma separated)
                    </label>
                    <input
                      type="text"
                      id="sizes"
                      placeholder="S, M, L, XL or 41mm, 45mm"
                      value={sizesText}
                      onChange={(e) => setSizesText(e.target.value)}
                      className="w-full bg-muted/20 border border-border/80 rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> Description</span>
                  </label>
                  <textarea
                    id="description"
                    required
                    placeholder="Provide a detailed description of the product features, specifications, and materials..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="5"
                    className="w-full bg-muted/20 border border-border/80 rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all resize-none"
                  ></textarea>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Stock Card */}
            <div className="space-y-6">
              <Card className="border-border/50 bg-card/30 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Pricing & Inventory
                  </CardTitle>
                  <CardDescription>Manage selling prices, discount targets, and count in stock</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Sale Price ($)
                      </label>
                      <input
                        type="number"
                        id="price"
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-muted/20 border border-border/80 rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="originalPrice" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Original Price ($)
                      </label>
                      <input
                        type="number"
                        id="originalPrice"
                        min="0"
                        step="0.01"
                        placeholder="Optional"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        className="w-full bg-muted/20 border border-border/80 rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="countInStock" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Units In Stock
                    </label>
                    <input
                      type="number"
                      id="countInStock"
                      required
                      min="0"
                      placeholder="0"
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                      className="w-full bg-muted/20 border border-border/80 rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Media Card */}
              <Card className="border-border/50 bg-card/30 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    Product Images
                  </CardTitle>
                  <CardDescription>Upload main image and supplementary gallery files</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Main Image URL
                    </label>
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        required
                        placeholder="/images/example.jpg"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full bg-muted/20 border border-border/80 rounded-xl px-4 py-2.5 text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                      />
                      <label className="flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-border/80 rounded-xl cursor-pointer hover:bg-muted/20 transition-all">
                        {loadingUpload ? (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : (
                          <Upload className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground font-medium">
                          {loadingUpload ? 'Uploading Image...' : 'Upload Image File'}
                        </span>
                        <input 
                          type="file" 
                          onChange={uploadFileHandler}
                          className="hidden"
                          disabled={loadingUpload}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Gallery Images
                    </label>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-border/80 rounded-xl cursor-pointer hover:bg-muted/20 transition-all">
                        {loadingMultipleUpload ? (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : (
                          <Upload className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground font-medium">
                          {loadingMultipleUpload ? 'Uploading Gallery Files...' : 'Upload Supplementary Files'}
                        </span>
                        <input 
                          type="file" 
                          multiple
                          onChange={uploadMultipleFilesHandler}
                          className="hidden"
                          disabled={loadingMultipleUpload}
                        />
                      </label>
                      
                      {images && images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {images.map((img, index) => (
                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted/20">
                              <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-destructive/90 text-destructive-foreground hover:bg-destructive p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              disabled={loadingUpdate}
              onClick={() => navigate('/admin/productlist')}
              className="px-6 py-2.5 rounded-xl border-border text-foreground hover:bg-muted/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loadingUpdate}
              className="px-8 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 gap-2"
            >
              {loadingUpdate && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default ProductEditScreen;
