# Constructing a zkBridge

Finally, we have all the parts to construct a zkBridge.

Precisely speaking, we will write circuit of a state-proof verification algorithm.

As always, we start with headers and namespaces:

```cpp
#include <nil/crypto3/hash/algorithm/hash.hpp>
#include <nil/crypto3/hash/sha2.hpp>
#include <nil/crypto3/algebra/fields/curve25519/base_field.hpp>
#include <nil/crypto3/algebra/fields/curve25519/scalar_field.hpp>
#include <nil/crypto3/algebra/curves/ed25519.hpp>
#include <nil/crypto3/algebra/curves/pallas.hpp>

using namespace nil::crypto3::hashes;
using namespace nil::crypto3::algebra::curves;
```

Here we have included the following components:

- Headers for hashes: we will use `sha2-256` hash algorithm in our zk-Bridge.
- The `curve25519` elliptic curve for operations with curve elements in EdDSA signature algorithm.
- The `pallas` field to store the Merkle tree nodes in it.

We will now use the following custom types for our algorithm:

```cpp
struct eddsa_signature_type {
    typename ed25519::template g1_type<>::value_type R;
    typename ed25519::scalar_field_type::value_type s;
};

typedef __attribute__((ext_vector_type(4)))
                typename pallas::base_field_type::value_type eddsa_message_block_type;

struct block_data_type {
    typename sha2<256>::block_type prev_block_hash;
    typename sha2<256>::block_type data;
    std::array<eddsa_signature_type, 16> validators_signatures;
    std::array<typename ed25519::template g1_type<>::value_type, 16> validators_keys;
    eddsa_signature_type validators_signature;
    typename ed25519::template g1_type<>::value_type validators_key;
};
```

Now let's add the EdDSA signature verification function from the [previous tutorial](./eddsa):

```cpp
bool verify_eddsa_signature (eddsa_signature_type input,
    typename ed25519::template g1_type<>::value_type pk,
    eddsa_message_block_type M) {

        typename ed25519::template g1_type<>::value_type B = ed25519::template g1_type<>::value_type::one();
        __zkllvm_field_curve25519_scalar k = __builtin_assigner_sha2_512_curve25519(input.R.data, pk.data, M);

        return (B*input.s - (input.R + (pk*k))).is_zero();
}
```

And after adding the final function for verification of the unconfirmed blocks, the code will look like this:

```cpp
#include <nil/crypto3/hash/algorithm/hash.hpp>
#include <nil/crypto3/hash/sha2.hpp>
#include <nil/crypto3/algebra/fields/curve25519/base_field.hpp>
#include <nil/crypto3/algebra/fields/curve25519/scalar_field.hpp>
#include <nil/crypto3/algebra/curves/ed25519.hpp>
#include <nil/crypto3/algebra/curves/pallas.hpp>

using namespace nil::crypto3;
using namespace nil::crypto3::algebra::curves;

typedef __attribute__((ext_vector_type(4)))
                typename pallas::base_field_type::value_type eddsa_message_block_type;

struct eddsa_signature_type {
    typename ed25519::template g1_type<>::value_type R;
    typename ed25519::scalar_field_type::value_type s;
};

bool verify_eddsa_signature (eddsa_signature_type input,
    typename ed25519::template g1_type<>::value_type pk,
    eddsa_message_block_type M) {

        typename ed25519::template g1_type<>::value_type B = ed25519::template g1_type<>::value_type::one();
        __zkllvm_field_curve25519_scalar k = __builtin_assigner_sha2_512_curve25519(input.R.data, pk.data, M);

        return (B*input.s - (input.R + (pk*k))).is_zero();
}

struct block_data_type {
    typename sha2<256>::block_type prev_block_hash;
    typename sha2<256>::block_type data;
    std::array<eddsa_signature_type, 16> validators_signatures;
    std::array<typename ed25519::template g1_type<>::value_type, 16> validators_keys;
    eddsa_signature_type validators_signature;
    typename ed25519::template g1_type<>::value_type validators_key;
};

bool is_same(typename sha2<256>::block_type block0,
    typename sha2<256>::block_type block1){

    return block0[0] == block1[0] && block0[1] == block1[1];
}

// The circuit function itself starts with [[circuit]]
[[circuit]] bool verify_protocol_state_proof (
    typename sha2<256>::block_type last_confirmed_block_hash,
    std::array<block_data_type, 64> unconfirmed_blocks) {

    for (int i = 0; i < unconfirmed_blocks.size(); i++) {

        // Check hashes correctness
        if (i == 0) {
            if (!is_same(unconfirmed_blocks[i].prev_block_hash,
                last_confirmed_block_hash)) {
                return false;
            }
        } else {
            typename sha2<256>::block_type evaluated_block_hash =
                hash<sha2<256>>(unconfirmed_blocks[i-1].prev_block_hash,
                    unconfirmed_blocks[i-1].data);

            if (!is_same(unconfirmed_blocks[i].prev_block_hash,
                evaluated_block_hash)) {
                return false;
            }
        }

        // Verify signatures
        for (int j = 0; j < 16; j++) {
            eddsa_message_block_type message = {unconfirmed_blocks[i].prev_block_hash[0],
                unconfirmed_blocks[i].prev_block_hash[1],
                unconfirmed_blocks[i].data[0],
                unconfirmed_blocks[i].data[1]};

            if (!verify_eddsa_signature(unconfirmed_blocks[i].validators_signatures[j],
                    unconfirmed_blocks[i].validators_keys[j],
                    message)) {
                return false;
            }
        }
    }

    return true;
}
```

That's it!

Now we can compile this code to a state-proof verification circuit and build a zkBridge upon it.
