import { Box, Button, Typography } from '@material-ui/core';
import { AccessTime, Check, Delete, Edit, PermIdentityRounded, Block } from '@material-ui/icons';
import React from 'react';
import { getCreatedTime } from '../../utils/getCreatedTime';
import TimeLeft from '../TimeLeft/TimeLeft';
import useStyles from './ProductItemV2.styles';
import storeIcon from '../../assets/images/store.svg';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { uiActions } from '../../slices/ui.slice';
import { formatMoney } from '../../utils/formatMoney';
import { toast } from 'react-toastify';
import { favoriteDelete } from '../../slices/favorite.slice';
function ProductItemV2({
  who = 'bidder',
  productId,
  title,
  seller,
  sellerId,
  sellerPoint,
  status,
  imgSrc,
  totalBid,
  dateCreated,
  dateEnd,
  currentPrice,
  currentBidder,
  currentBidderPoint,
  type = 'auction-won',
  isRate = false,
  primary = false,
  sell_status = 'processing',
  currentBidderId,
  sellerRateStatus,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const openModalEditHandler = () => {
    dispatch(uiActions.setUpdateProduct({ product_id: +productId, type: 'updateProduct' }));
    dispatch(uiActions.openModal('openUpdate'));
  };
  const openModalRateHandler = () => {
    dispatch(uiActions.openModal('openRate'));
    dispatch(
      uiActions.setRate({
        product_id: +productId,
        user_id_2: +sellerId,
        type,
      })
    );
  };
  const openSellerAcceptModal = () => {
    dispatch(uiActions.openModal('openSellerAccept'));
    dispatch(
      uiActions.setSeller({
        type: 'accept',
        product_id: +productId,
        bidder_id: +currentBidderId,
      })
    );
  };
  const openSellerDenyModal = () => {
    dispatch(uiActions.openModal('openSellerDeny'));
    dispatch(
      uiActions.setSeller({
        type: 'deny',
        product_id: +productId,
        bidder_id: +currentBidderId,
      })
    );
  };

  const deleteFromFavoriteHandler = async (product_id) => {
    try {
      await dispatch(
        favoriteDelete({
          product_id: productId,
        })
      ).unwrap();
      toast.success('X??a kh???i y??u th??ch th??nh c??ng');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className={`${classes.root} ${primary ? classes.primary : ''}`}>
      {who !== 'seller' && (
        <div className={classes.top}>
          <Box display="flex" alignItems="center">
            <img src={storeIcon} alt="store" style={{ marginRight: 5 }} />
            <Typography variant="caption">
              <b>Ng?????i b??n: {seller}</b>
            </Typography>
          </Box>
          <Typography variant="h4" className={classes.status}>
            {status === 'done'
              ? 'Th??nh c??ng'
              : status === 'failed'
              ? 'Th???t b???i'
              : status === 'denied'
              ? 'B??? t??? ch???i'
              : status === 'expired'
              ? '???? k???t th??c'
              : '??ang di???n ra'}
          </Typography>
        </div>
      )}

      <div className={classes.middle}>
        <img
          src={imgSrc || process.env.REACT_APP_BASE_IMAGE}
          alt={title}
          style={{ maxHeight: 150, objectFit: 'cover', objectPosition: 'top' }}
        />
        <div className={classes.info}>
          <Link to={`/detail/${productId}`} className={classes.xizot}>
            <Typography variant="h5" className={classes.title}>
              {title}
            </Typography>
            <div className={classes.total}>
              <PermIdentityRounded />
              <Typography variant="caption" className={classes.max}>
                <b>{totalBid || 0}</b>
              </Typography>
            </div>
          </Link>
          <Typography variant="body2" className={classes.created}>
            <AccessTime fontSize="small" style={{ marginRight: 5 }} /> {getCreatedTime(dateCreated)}
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <div>
              <TimeLeft timeEnd={dateEnd} />
            </div>
            <Box textAlign="right" className={classes.state}>
              <Typography variant="body1">
                Gi?? hi???n t???i: <b>{formatMoney(currentPrice)}??</b>
              </Typography>
              {currentBidder && (
                <Typography variant="body1">
                  Ra gi?? cao nh???t:{' '}
                  <b>
                    @{currentBidder} ({currentBidderPoint})
                  </b>
                </Typography>
              )}
            </Box>
          </Box>
        </div>
      </div>
      <div className={classes.bottom}>
        {who === 'bidder' && status === 'done' && (
          <div className={classes.bottomContent}>
            {!isRate ? (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={openModalRateHandler}>
                ????nh gi??
              </Button>
            ) : (
              <Button variant="text" color="primary" disabled>
                ???? ????nh gi??
              </Button>
            )}
          </div>
        )}

        {who === 'seller' && (
          <div className={classes.bottomContent}>
            {sell_status === 'processing' && (
              <Button variant="contained" size="small" onClick={openModalEditHandler}>
                <Edit />
              </Button>
            )}
            {sell_status === 'hasBidder' && (
              <Box>
                {sellerRateStatus === 'pending' ? (
                  <>
                    {' '}
                    <Button
                      variant="contained"
                      size="small"
                      onClick={openSellerDenyModal}
                      startIcon={<Block />}>
                      T??? ch???i
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={openSellerAcceptModal}
                      startIcon={<Check />}>
                      Ch???p nh???n
                    </Button>
                  </>
                ) : sellerRateStatus === 'accepted' ? (
                  <Typography color="primary" variant="caption">
                    ???? ho??n t???t
                  </Typography>
                ) : (
                  <Typography color="secondary" variant="caption">
                    ???? t??? ch???i
                  </Typography>
                )}
              </Box>
            )}
          </div>
        )}
        {who === 'user-save' && (
          <div className={classes.bottomContent}>
            <Button
              onClick={() => deleteFromFavoriteHandler(productId)}
              variant="outlined"
              color="secondary"
              size="small"
              startIcon={<Delete />}>
              X??a kh???i danh s??ch
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductItemV2;
