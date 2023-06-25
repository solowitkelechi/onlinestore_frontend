import {Chain} from '@usedapp/core'

export const Linea: Chain = {
    chainId: 59140,
    chainName: 'Linea',
    isTestChain: false,
    isLocalChain: false,
    multicallAddress: '0x0000000000000000000000000000000000000000',
    getExplorerAddressLink: (address: string) => `https://explorer.goerli.linea.build/address/${address}`,
    getExplorerTransactionLink: (transactionHash: string) => `https://explorer.goerli.linea.build/tx/${transactionHash}`,
    blockExplorerUrl: 'https://explorer.goerli.linea.build',
    rpcUrl: 'https://rpc.goerli.linea.build/'
}

export const Taiko: Chain = {
    chainId: 167005,
    chainName: 'Taiko',
    isTestChain: false,
    isLocalChain: false,
    multicallAddress: '0x0000000000000000000000000000000000000000',
    getExplorerAddressLink: (address: string) => `https://explorer.test.taiko.xyz/address/${address}`,
    getExplorerTransactionLink: (transactionHash: string) => `https://explorer.test.taiko.xyz/tx/${transactionHash}`,
    blockExplorerUrl: 'https://explorer.test.taiko.xyz',
    rpcUrl: 'https://rpc.test.taiko.xyz/'
}

export const Base: Chain = {
    chainId: 84531,
    chainName: 'Base',
    isTestChain: false,
    isLocalChain: false,
    multicallAddress: '0x0000000000000000000000000000000000000000',
    getExplorerAddressLink: (address: string) => `https://goerli.basescan.org/address/${address}`,
    getExplorerTransactionLink: (transactionHash: string) => `https://goerli.basescan.org/tx/${transactionHash}`,
    blockExplorerUrl: 'https://goerli.basescan.org',
    rpcUrl: 'https://goerli.base.org'
}

export const Scroll: Chain = {
    chainId: 534353,
    chainName: 'Scroll',
    isTestChain: false,
    isLocalChain: false,
    multicallAddress: '0x0000000000000000000000000000000000000000',
    getExplorerAddressLink: (address: string) => `https://blockscout.scroll.io/address/${address}`,
    getExplorerTransactionLink: (transactionHash: string) => `https://blockscout.scroll.io/tx/${transactionHash}`,
    blockExplorerUrl: 'https://blockscout.scroll.io',
    rpcUrl: 'https://scroll-alphanet.public.blastapi.io'
}