pragma solidity 0.8.17;

import "./Ownable.sol";
import "./ERC721.sol";

contract TokenContract is ERC721, Ownable {
    uint256 private constant MAXAMOUNTOFHUMANS = 1000;

    constructor() ERC721("Token", "TKN") {}

    struct Human {
        uint256 id;
        string dna;
        address owner;
    }

    Human[] humans;
    uint randNonce = 0;

    event Breed(address indexed owner, uint256 indexed tokenId);

    function createHuman(string memory _dna) external onlyOwner {
        uint256 tokenId = _createHuman(_dna, msg.sender);

        emit Transfer(address(0), msg.sender, tokenId);
    }

    function getHuman(uint256 _id) external view returns (Human memory) {
        return humans[_id];
    }

    function getHumans() public view returns (Human[] memory) {
        return humans;
    }

    function breedHuman(uint256 _token1Id, uint256 _token2Id) external {
        require(
            _exists(_token1Id) && _exists(_token2Id),
            "Token does not exist"
        );
        require(
            ownerOf(_token1Id) == msg.sender &&
                ownerOf(_token2Id) == msg.sender,
            "Caller is not the owner of both tokens"
        );

        uint256 tokenId = _createHuman(
            _getNewDna(humans[_token1Id].dna, humans[_token2Id].dna),
            msg.sender
        );

        emit Breed(msg.sender, tokenId);
        emit Transfer(msg.sender, msg.sender, tokenId);
    }

    function _transferWithoutApproveReset(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        require(
            ownerOf(_tokenId) == _from,
            "ERC721: transfer from incorrect owner"
        );
        require(_to != address(0), "ERC721: transfer to the zero address");

        balances[_from] -= 1;
        balances[_to] += 1;
        owners[_tokenId] = _to;
        humans[_tokenId].owner = _to;

        emit Transfer(_from, _to, _tokenId);
    }

    function _createHuman(string memory _dna, address creator)
        private
        returns (uint256)
    {
        require(
            humans.length <= MAXAMOUNTOFHUMANS,
            "Max amount of humans reached"
        );

        Human memory newHuman = Human(humans.length, _dna, creator);
        humans.push(newHuman);
        owners[newHuman.id] = creator;
        balances[creator] += 1;

        return newHuman.id;
    }

    function _getNewDna(string memory _dna1, string memory _dna2)
        private
        returns (string memory)
    {
        string memory newDna = "";
        string[2] memory dnas = [_dna1, _dna2];

        for (uint256 i = 0; i < 5; i++) {
            newDna = string.concat(
                newDna,
                _substring(dnas[_get0or1(i)], i, i + 1)
            );
        }
        return newDna;
    }

    function _substring(
        string memory str,
        uint256 startIndex,
        uint256 endIndex
    ) private pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = strBytes[i];
        }
        return string(result);
    }

    function _get0or1(uint256 _index) private returns (uint256) {
        return (uint256(block.timestamp) + _index) % 2 == 0 ? 1 : 0;
    }
}
