import { View, Text } from "react-native";

import React, { useEffect } from "react";
import Card, { _imageWidth, width } from "./Card";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

const _spacing = 15;

type CarouselCard = {
  Regular: { Location: string; Price: number };
  Flipped: {
    PlayerType?: string;
    PropertyName: string;
    BaseRent: number;
    ServerCost?: number;
    Rent1Servers?: number;
    Rent2Servers?: number;
    Rent3Servers?: number;
    Rent4Servers?: number;
    Rent5Servers?: number;
  };
  Color: string;
};

const Carousel = ({
  currentIndex,
  cards,
}: {
  currentIndex: number;
  cards: CarouselCard[];
}) => {
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x / (_imageWidth + _spacing);
  });
  const flatListRef = React.useRef<Animated.FlatList>(null);

  useEffect(() => {
    if (cards.length > 0 && currentIndex >= 0) {
      // Wrap the index if it exceeds the cards length
      const wrappedIndex = currentIndex % cards.length;
      flatListRef.current?.scrollToIndex({
        index: wrappedIndex,
        animated: true,
      });
    }
  }, [currentIndex, cards.length]);

  if (cards.length === 0) {
    return (
      <View
        style={{ justifyContent: "center", alignItems: "center", padding: 20 }}
      >
        <Text style={{ color: "#fff" }}>No items to display</Text>
      </View>
    );
  }

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Animated.FlatList
        scrollEnabled={false}
        data={cards}
        ref={flatListRef}
        keyExtractor={(_, index) => String(index)}
        renderItem={({ item, index }) => (
          <Card item={item} index={index} scrollX={scrollX} />
        )}
        horizontal
        snapToInterval={_imageWidth + _spacing}
        decelerationRate="normal"
        contentContainerStyle={{
          gap: _spacing,
          paddingHorizontal: (width - _imageWidth) / 2,
        }}
        style={{ flexGrow: 0 }}
        onScroll={onScroll}
        scrollEventThrottle={1000 / 60} // 16.67ms
        showsHorizontalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: _imageWidth + _spacing,
          offset: (_imageWidth + _spacing) * index,
          index,
        })}
      />
    </View>
  );
};

export default Carousel;
