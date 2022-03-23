// contracts/TokenVesting.sol
// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.11;

import "./TokenVestingV2.sol";

/**
 * @title MockTokenVestingV2
 * WARNING: use only for testing and debugging purpose
 */
contract MockTokenVestingV2 is TokenVestingV2 {

    uint256 mockTime = 0;

    function setCurrentTime(uint256 _time)
        external{
        mockTime = _time;
    }

    function getCurrentTime()
        internal
        virtual
        override
        view
        returns(uint256){
        return mockTime;
    }
}
