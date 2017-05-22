<template>
    <div>
        <h1>cnapoi te;ljl</h1>
        <ul>
            <li v-for="item in lists">{{item.title}} </li>
        </ul>
        <ul>
            <li>woui1 </li>
            <li>2</li>
            <li>3</li>
        </ul>

    </div>
</template>

<script>
    export default{
    data() {
        return {
            lists:[{
                id:1,
                title:'test title1'
            },{
                id:2,
                title:'test title2'
            }]
        }
    }
    }
</script>