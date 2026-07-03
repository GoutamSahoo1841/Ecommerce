import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Loader2, Package, Tag, Layers } from 'lucide-react';
import { 
  useGetProductsQuery, 
  useCreateProductMutation, 
  useDeleteProductMutation 
} from '../../slices/productsApiSlice';
import Paginate from '../../components/Paginate';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNumber });
  const products = data?.products || [];

  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const navigate = useNavigate();

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await createProduct();
        refetch();
      } catch (err) {
        console.error(err?.data?.message || err.error);
        alert(err?.data?.message || err.error);
      }
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        console.error(err?.data?.message || err.error);
        alert(err?.data?.message || err.error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            Products Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create, edit, and delete products in your store catalog
          </p>
        </div>
        <Button
          onClick={createProductHandler}
          className="w-full sm:w-auto gap-2"
          disabled={loadingCreate}
        >
          {loadingCreate ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Create Product
        </Button>
      </div>

      {loadingDelete && (
        <Card className="border-warning/30 bg-warning/10">
          <CardContent className="flex items-center gap-3 p-4">
            <Loader2 className="h-5 w-5 animate-spin text-warning" />
            <span className="text-sm font-medium text-warning-foreground">Deleting product...</span>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-24 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse text-sm">Loading product catalog...</p>
        </div>
      ) : error ? (
        <Card className="border-destructive/30 bg-destructive/10">
          <CardContent className="flex items-center gap-3 p-6 text-destructive-foreground">
            <span className="font-semibold text-sm">Error:</span>
            <span className="text-sm">{error?.data?.message || error.error}</span>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50 bg-card/30 backdrop-blur-md overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/20 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th scope="col" className="px-6 py-4">ID</th>
                    <th scope="col" className="px-6 py-4">Name</th>
                    <th scope="col" className="px-6 py-4">Price</th>
                    <th scope="col" className="px-6 py-4">Category</th>
                    <th scope="col" className="px-6 py-4">Brand</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 text-sm">
                  {products.map((product, idx) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-muted/10 transition-colors group"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {product._id}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground max-w-[240px] truncate group-hover:text-primary transition-colors">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        ${product.price?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="gap-1 bg-secondary/40 text-secondary-foreground hover:bg-secondary/60">
                          <Layers className="h-3 w-3" />
                          {product.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="gap-1 border-border/60 hover:bg-muted/30">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          {product.brand}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Link to={`/admin/product/${product._id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteHandler(product._id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                        No products found in the catalog.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {data?.pages && data?.pages > 1 && (
        <div className="flex justify-end pt-4">
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </div>
      )}
    </motion.div>
  );
};

export default ProductListScreen;

