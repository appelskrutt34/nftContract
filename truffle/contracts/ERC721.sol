pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract ERC721 {
    string internal name;
    string internal symbol;

    // Mapping from token ID to owner address
    mapping(uint256 => address) internal owners;

    // Mapping owner address to token count
    mapping(address => uint256) internal balances;

    // Mapping from token ID to approved address
    mapping(uint256 => address) internal tokenApprovals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) internal operatorApprovals;

    /**
     * @dev Emitted when `tokenId` token is transferred from `from` to `to`.
     */
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    /**
     * @dev Emitted when `owner` enables `approved` to manage the `tokenId` token.
     */
    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );

    /**
     * @dev Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.
     */
    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }

    function balanceOf(address owner) public view returns (uint256 balance) {
        return balances[owner];
    }

    function ownerOf(uint256 _tokenId) public view returns (address owner) {
        return owners[_tokenId];
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) public {
        require(
            _isApprovedOrOwner(msg.sender, _tokenId),
            "ERC721: caller is not token owner nor approved"
        );
        _safeTransfer(_from, _to, _tokenId, _data);
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public {
        safeTransferFrom(_from, _to, _tokenId, "");
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external virtual {
        require(
            _isApprovedOrOwner(msg.sender, _tokenId),
            "ERC721: caller is not token owner nor approved"
        );

        _transfer(_from, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public {
        require(
            ownerOf(_tokenId) == msg.sender,
            "ERC721: caller not owner of the token"
        );
        _approve(_to, _tokenId);
    }

    function setApprovalForAll(address _operator, bool _approved) public {
        require(msg.sender != _operator, "ERC721: approve to caller");
        operatorApprovals[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function getApproved(uint256 _tokenId)
        public
        view
        returns (address operator)
    {
        require(_exists(_tokenId), "ERC721: token does not exist");
        return tokenApprovals[_tokenId];
    }

    function isApprovedForAll(address owner, address operator)
        public
        view
        returns (bool)
    {
        return operatorApprovals[owner][operator];
    }

    function _safeTransfer(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) internal {
        _transfer(_from, _to, _tokenId);
        require(
            _checkOnERC721Received(_from, _to, _tokenId, _data),
            "ERC721: transfer to non ERC721Receiver implementer"
        );
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        require(
            ownerOf(_tokenId) == _from,
            "ERC721: transfer from incorrect owner"
        );
        require(_to != address(0), "ERC721: transfer to the zero address");

        _approve(address(0), _tokenId);

        balances[_from] -= 1;
        balances[_to] += 1;
        owners[_tokenId] = _to;

        emit Transfer(_from, _to, _tokenId);
    }

    function _approve(address to, uint256 tokenId) internal {
        tokenApprovals[tokenId] = to;
        emit Approval(ownerOf(tokenId), to, tokenId);
    }

    function _isApprovedOrOwner(address _spender, uint256 _tokenId)
        internal
        view
        returns (bool)
    {
        address owner = ownerOf(_tokenId);
        return (_spender == owner ||
            isApprovedForAll(owner, _spender) ||
            getApproved(_tokenId) == _spender);
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return owners[tokenId] != address(0);
    }

    function _isContract(address account) private view returns (bool) {
        return account.code.length > 0;
    }

    function _checkOnERC721Received(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) private returns (bool) {
        if (_isContract(_to)) {
            try
                IERC721Receiver(_to).onERC721Received(
                    msg.sender,
                    _from,
                    _tokenId,
                    _data
                )
            returns (bytes4 retval) {
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory) {
                revert("ERC721: transfer to non ERC721Receiver implementer");
            }
        } else {
            return true;
        }
    }

    function supportsInterface(bytes4 _interfaceId)
        external
        pure
        returns (bool)
    {
        return
            _interfaceId == type(IERC721).interfaceId ||
            _interfaceId == type(IERC165).interfaceId;
    }
}
