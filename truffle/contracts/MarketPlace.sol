pragma solidity 0.8.17;

import "./TokenContract.sol";

contract MarketPlace is TokenContract {
    struct Listing {
        uint256 tokenId;
        uint256 price;
        address payable seller;
        uint256 index;
    }

    Listing[] listings;
    event ListingEnded(uint256 tokenId, address buyer, uint256 price);
    event ListingCreated(uint256 tokenId, address seller, uint256 price);

    function createListing(uint256 _tokenId, uint256 _price) external {
        require(
            ownerOf(_tokenId) == msg.sender,
            "Marketplace: caller not owner of token"
        );
        require(_price > 0, "Marketplace: price not bigger than 0");
        require(
            getListing(_tokenId).seller == address(0),
            "Marketplace: listing already exist"
        );

        listings.push(
            Listing(_tokenId, _price, payable(msg.sender), listings.length)
        );

        _transferWithoutApproveReset(msg.sender, address(this), _tokenId);
        emit ListingCreated(_tokenId, msg.sender, _price);
    }

    function removeListing(uint256 _tokenId) external {
        Listing memory listing = getListing(_tokenId);
        require(
            listing.seller != address(0),
            "Marketplace: listing does not exist"
        );
        require(
            listing.seller == msg.sender,
            "Marketplace: caller not seller of token"
        );

        _removeListing(listing);
        _transferWithoutApproveReset(address(this), msg.sender, _tokenId);

        emit ListingEnded(_tokenId, msg.sender, 0);
    }

    function buy(uint256 _tokenId) external payable {
        Listing memory listing = getListing(_tokenId);
        require(
            listing.seller != address(0),
            "MarketPlace: listing does not exist"
        );
        require(
            listing.seller != msg.sender,
            "MarketPlace: buyer cant be same as seller"
        );
        require(
            listing.price == msg.value,
            "MarketPlace: value does not match price"
        );

        _removeListing(listing);
        _transferWithoutApproveReset(address(this), msg.sender, _tokenId);
        listing.seller.transfer(msg.value);

        emit ListingEnded(_tokenId, msg.sender, listing.price);
    }

    function getListing(uint256 _tokenId) public view returns (Listing memory) {
        for (uint256 i = 0; i < listings.length; i++) {
            if (listings[i].tokenId == _tokenId) {
                return listings[i];
            }
        }
        return Listing(0, 0, payable(address(0)), 0);
    }

    function getListings() external view returns (Listing[] memory) {
        return listings;
    }

    function _removeListing(Listing memory listing) private {
        Listing memory lastListing = listings[listings.length - 1];

        if (lastListing.tokenId == listing.tokenId) {
            delete listings[lastListing.index];
            listings.pop();
        } else {
            delete listings[listing.index];
            delete listings[lastListing.index];

            listings[listing.index] = lastListing;
            listings[listing.index].index = listing.index;
            listings.pop();
        }
    }
}
