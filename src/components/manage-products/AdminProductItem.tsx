import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { formatAmount } from "../../helpers";
import { Product } from "../../types";


interface Props {
  product: Product;
  setOpenProductForm: (open: boolean) => void;
  setProductToEdit: (product: Product | null) => void;
  setOpenDialog: (open: boolean) => void;
  setProductToDelete: (product: Product | null) => void;
}

const AdminProductItem: React.FC<Props> = ({
  product,
  setOpenProductForm,
  setProductToEdit,
  setOpenDialog,
  setProductToDelete
}) => {

  return (
    <tr>
      <td className="table-cell">{product.title}</td>
      <td className="table-cell">
        <img src={product.imageUrl} alt={product.title} width="30px" />
      </td>
      <td className="table-cell">{formatAmount(product.price)}</td>
      <td className="table-cell table-cell--hide">
        {product.createdAt && product.createdAt.toDate().toDateString()}{" "}
      </td>
      <td className="table-cell table-cell--hide">
        {product.updatedAt && product.updatedAt.toDate().toDateString()}
      </td>
      <td 
        className="table-cell"
        style={{ color: product.inventory === 0 ? 'red' : undefined}}
      >{product.inventory}</td>
      <td
        className="table-cell table-cell--icon"
        onClick={() => {
          setOpenProductForm(true);
          setProductToEdit(product);
        }}
      >
        <FontAwesomeIcon icon={["fas", "edit"]} size="1x" />
      </td>
      <td className="table-cell table-cell--icon">
        
          <FontAwesomeIcon
            icon={["fas", "trash"]}
            size="1x"
            color="red"
            onClick={() => {
              setProductToDelete(product)
              setOpenDialog(true)
            }}
          />
        
      </td>
    </tr>
  );
};

export default AdminProductItem;
