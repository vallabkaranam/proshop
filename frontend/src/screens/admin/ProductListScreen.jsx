import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import Paginate from '../../components/Paginate'
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from '../../slices/productsApiSlice'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const ProductListScreen = () => {
  const { pageNumber } = useParams()

  const {
    data,
    isLoading,
    error,
    // refetch
  } = useGetProductsQuery({
    pageNumber,
  })

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation()

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation()

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await createProduct()
        // could then refetch products list here, but looks like we don't need to
        // as it's already been refetched by useGetProductsQuery
      } catch (err) {
        toast.error(err?.data?.message || err.message)
      }
    }
  }

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id)
        // could refetch products list here,
        // or can achieve the same by invalidating tags
        // in the productsApiSlice for this query

        toast.success('Product deleted')
      } catch (err) {
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm m-3" onClick={createProductHandler}>
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>$ {product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin />
        </>
      )}
    </>
  )
}

export default ProductListScreen
