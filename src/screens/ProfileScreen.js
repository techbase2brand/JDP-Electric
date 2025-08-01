import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheet,
} from 'react-native';
import {profileSections} from '../constants/profileData';
import {
  validateProfileForm,
  showSuccessAlert,
  handlePhotoUpload,
  handleTakePhoto,
  handleRemovePhoto,
  getInitialEditForm,
} from '../components/helper/profileHelpers';
import {PhotoOptionsModal, ConfirmationModal} from '../components/ProfileModals';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  department?: string;
  skills?: string[];
  hire_date?: string;
  avatar?: string;
}

const ProfileScreen = React.memo(({user, onNavigate, onLogout, navigation}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [editForm, setEditForm] = useState(getInitialEditForm(user));

  // Animation values
  const scrollY = useMemo(() => new Animated.Value(0), []);
  const fadeAnim = useMemo(() => new Animated.Value(1), []);
  const scaleAnim = useMemo(() => new Animated.Value(1), []);

  // Smooth layout animation configuration
  const smoothLayoutAnimation = {
    duration: 300,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
  };

  const handleSaveProfile = useCallback(() => {
    if (validateProfileForm(editForm)) {
      LayoutAnimation.configureNext(smoothLayoutAnimation);
      showSuccessAlert('Profile updated successfully!');
      setIsEditing(false);
    }
  }, [editForm]);

  const handleEditToggle = useCallback(() => {
    LayoutAnimation.configureNext(smoothLayoutAnimation);
    setIsEditing(!isEditing);
  }, [isEditing]);

  const handleLogoutConfirm = useCallback(() => {
    setShowLogoutConfirm(false);
    onLogout();
    showSuccessAlert('Logged out successfully');
  }, [onLogout]);

  const handleDeleteConfirm = useCallback(() => {
    setShowDeleteConfirm(false);
    showSuccessAlert('Account deletion request submitted');
    onLogout();
  }, [onLogout]);

  const handleMenuItemPress = useCallback(
    (item: any) => {
      // Add subtle press animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.98,
          duration: 100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();

      if (item.screen) {
        onNavigate(item.screen);
      } else if (item.action === 'logout') {
        setShowLogoutConfirm(true);
      } else if (item.action === 'delete') {
        setShowDeleteConfirm(true);
      }
    },
    [onNavigate, scaleAnim],
  );

  const handlePhotoOptionsToggle = useCallback(() => {
    setShowPhotoOptions(!showPhotoOptions);
  }, [showPhotoOptions]);

  const handleFormChange = useCallback((field, value) => {
    setEditForm(prev => ({...prev, [field]: value}));
  }, []);

  const renderSkillBadge = useCallback(
    (skill, index) => (
      <Animated.View
        key={index}
        style={[
          styles.skillBadge,
          {
            transform: [{scale: scaleAnim}],
          },
        ]}>
        <Text style={styles.skillBadgeText}>{skill}</Text>
      </Animated.View>
    ),
    [scaleAnim],
  );

  const renderProfileSection = useCallback(
    (section, sectionIndex) => (
      <Animated.View
        key={sectionIndex}
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, -10],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{section.title}</Text>
        </View>
        <View style={styles.cardContent}>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity
              key={itemIndex}
              onPress={() => handleMenuItemPress(item)}
              style={[
                styles.menuItem,
                item.dangerous && styles.dangerousMenuItem,
              ]}
              activeOpacity={0.7}
              onPressIn={() => {
                Animated.timing(scaleAnim, {
                  toValue: 0.98,
                  duration: 100,
                  useNativeDriver: true,
                }).start();
              }}
              onPressOut={() => {
                Animated.timing(scaleAnim, {
                  toValue: 1,
                  duration: 100,
                  useNativeDriver: true,
                }).start();
              }}>
              <View style={styles.menuItemLeft}>
                <Animated.View
                  style={[
                    styles.iconContainer,
                    item.dangerous
                      ? styles.dangerousIconContainer
                      : styles.normalIconContainer,
                    {transform: [{scale: scaleAnim}]},
                  ]}>
                  <Text style={styles.iconText}>{item.icon}</Text>
                </Animated.View>
                <View style={styles.menuItemText}>
                  <Text
                    style={[
                      styles.menuItemLabel,
                      item.dangerous && styles.dangerousText,
                    ]}>
                    {item.label}
                  </Text>
                  <Text style={styles.menuItemDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.chevron,
                  item.dangerous && styles.dangerousChevron,
                ]}>
                ›
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    ),
    [fadeAnim, scrollY, scaleAnim, handleMenuItemPress],
  );

  const headerAnimatedStyle = useMemo(
    () => ({
      transform: [
        {
          translateY: scrollY.interpolate({
            inputRange: [0, 50],
            outputRange: [0, -25],
            extrapolate: 'clamp',
          }),
        },
      ],
    }),
    [scrollY],
  );

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}
        bounces={true}
        bouncesZoom={false}>
        {/* Header */}
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                activeOpacity={0.7}>
                <Text style={styles.backButtonText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Profile</Text>
            </View>
            <View style={styles.headerRight}>
              {isEditing ? (
                <Animated.View
                  style={[styles.editActions, {opacity: fadeAnim}]}>
                  <TouchableOpacity
                    onPress={handleEditToggle}
                    style={styles.actionButton}
                    activeOpacity={0.7}>
                    <Text style={styles.actionButtonText}>✕</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveProfile}
                    style={styles.actionButton}
                    activeOpacity={0.7}>
                    <Text style={styles.actionButtonText}>💾</Text>
                  </TouchableOpacity>
                </Animated.View>
              ) : (
                <TouchableOpacity
                  onPress={handleEditToggle}
                  style={styles.actionButton}
                  activeOpacity={0.7}>
                  <Text style={styles.actionButtonText}>✏️</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Profile Header */}
          <Animated.View style={[styles.profileHeader, {opacity: fadeAnim}]}>
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <Animated.View
                  style={[styles.avatar, {transform: [{scale: scaleAnim}]}]}>
                  <Text style={styles.avatarText}>{editForm.avatar}</Text>
                </Animated.View>
                {isEditing && (
                  <Animated.View style={{opacity: fadeAnim}}>
                    <TouchableOpacity
                      onPress={handlePhotoOptionsToggle}
                      style={styles.cameraButton}
                      activeOpacity={0.8}>
                      <Text style={styles.cameraButtonText}>📷</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </View>
              <View style={styles.userInfo}>
                {isEditing ? (
                  <Animated.View
                    style={[styles.editFormContainer, {opacity: fadeAnim}]}>
                    <TextInput
                      value={editForm.name}
                      onChangeText={text => handleFormChange('name', text)}
                      style={styles.editInput}
                      placeholder="Full Name"
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    />
                    <TextInput
                      value={editForm.email}
                      onChangeText={text => handleFormChange('email', text)}
                      style={styles.editInput}
                      placeholder="Email Address"
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    />
                  </Animated.View>
                ) : (
                  <Animated.View style={{opacity: fadeAnim}}>
                    <Text style={styles.userName}>{user?.name || 'User'}</Text>
                    <Text style={styles.userEmail}>{user?.email || ''}</Text>
                    <View style={styles.badgeContainer}>
                      <Animated.View
                        style={[
                          styles.badge,
                          user?.role === 'Lead Labor'
                            ? styles.leadBadge
                            : styles.regularBadge,
                          {transform: [{scale: scaleAnim}]},
                        ]}>
                        <Text style={styles.badgeText}>
                          {user?.role || 'Employee'}
                        </Text>
                      </Animated.View>
                      <Animated.View
                        style={[
                          styles.departmentBadge,
                          {transform: [{scale: scaleAnim}]},
                        ]}>
                        <Text style={styles.departmentBadgeText}>
                          {user?.department || 'Department'}
                        </Text>
                      </Animated.View>
                    </View>
                  </Animated.View>
                )}
              </View>
            </View>
          </Animated.View>
        </Animated.View>

        <Animated.View style={[styles.content, {opacity: fadeAnim}]}>
          {/* Personal Information Card */}
          <Animated.View
            style={[
              styles.card,
              {
                transform: [
                  {
                    translateY: scrollY.interpolate({
                      inputRange: [0, 100],
                      outputRange: [0, -5],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardIcon}>👤</Text>
                <Text style={styles.cardTitle}>Personal Information</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              {isEditing ? (
                <Animated.View style={[styles.editForm, {opacity: fadeAnim}]}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <TextInput
                      value={editForm.phoneNumber}
                      onChangeText={text =>
                        handleFormChange('phoneNumber', text)
                      }
                      style={styles.input}
                      placeholder="Phone number"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Department</Text>
                    <TextInput
                      value={editForm.department}
                      onChangeText={text =>
                        handleFormChange('department', text)
                      }
                      style={styles.input}
                      placeholder="Department"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      Skills (comma separated)
                    </Text>
                    <TextInput
                      value={editForm.skills}
                      onChangeText={text => handleFormChange('skills', text)}
                      style={styles.input}
                      placeholder="e.g., Electrical Installation, Troubleshooting"
                    />
                  </View>
                </Animated.View>
              ) : (
                <View style={styles.infoContainer}>
                  <Animated.View
                    style={[
                      styles.infoItem,
                      {transform: [{scale: scaleAnim}]},
                    ]}>
                    <Text style={styles.infoIcon}>📞</Text>
                    <View style={styles.infoText}>
                      <Text style={styles.infoLabel}>Phone</Text>
                      <Text style={styles.infoValue}>
                        {user?.phone || 'Not provided'}
                      </Text>
                    </View>
                  </Animated.View>
                  <Animated.View
                    style={[
                      styles.infoItem,
                      {transform: [{scale: scaleAnim}]},
                    ]}>
                    <Text style={styles.infoIcon}>📅</Text>
                    <View style={styles.infoText}>
                      <Text style={styles.infoLabel}>Start Date</Text>
                      <Text style={styles.infoValue}>
                        {user?.hire_date
                          ? new Date(user.hire_date).toLocaleDateString()
                          : 'Not provided'}
                      </Text>
                    </View>
                  </Animated.View>
                  <Animated.View
                    style={[styles.skillsSection, {opacity: fadeAnim}]}>
                    <View style={styles.skillsHeader}>
                      <Text style={styles.infoIcon}>🏆</Text>
                      <Text style={styles.infoLabel}>Skills</Text>
                    </View>
                    <View style={styles.skillsContainer}>
                      {user?.skills && user.skills.length > 0 ? (
                        user.skills.map((skill, index) =>
                          renderSkillBadge(skill, index),
                        )
                      ) : (
                        <Text style={styles.noSkillsText}>
                          No skills listed
                        </Text>
                      )}
                    </View>
                  </Animated.View>
                </View>
              )}
            </View>
          </Animated.View>

          {/* Profile Sections */}
          {profileSections.map((section, sectionIndex) =>
            renderProfileSection(section, sectionIndex),
          )}
        </Animated.View>
      </Animated.ScrollView>

      {/* Modals */}
      <PhotoOptionsModal
        visible={showPhotoOptions}
        onClose={() => setShowPhotoOptions(false)}
        onTakePhoto={() => {
          handleTakePhoto();
          setShowPhotoOptions(false);
        }}
        onUploadPhoto={() => {
          handlePhotoUpload();
          setShowPhotoOptions(false);
        }}
        onRemovePhoto={() => {
          handleRemovePhoto(user, setEditForm);
          setShowPhotoOptions(false);
        }}
      />

      <ConfirmationModal
        visible={showLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        confirmText="Logout"
      />

      <ConfirmationModal
        visible={showDeleteConfirm}
        title="Delete Account"
        message="Are you sure you want to permanently delete your account? This action cannot be undone."
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        dangerous={true}
      />
    </View>
  );
});


export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    marginBottom: 80,
  },
  header: {
    backgroundColor: '#3B82F6',
    paddingTop: Platform.OS === 'ios' ? 48 : 32,
    paddingBottom: 24,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  profileHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cameraButtonText: {
    fontSize: 14,
    textAlign: 'center',
  },
  userInfo: {
    flex: 1,
  },
  editFormContainer: {
    gap: 8,
  },
  editInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontSize: 16,
    minHeight: 44,
  },
  userName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  leadBadge: {
    backgroundColor: '#EAB308',
  },
  regularBadge: {
    backgroundColor: '#3B82F6',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  departmentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  departmentBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    padding: 16,
    gap: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 8,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardIcon: {
    fontSize: 20,
    color: '#3B82F6',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  cardContent: {
    padding: 16,
  },
  editForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 44,
  },
  infoContainer: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    minHeight: 56,
  },
  infoIcon: {
    fontSize: 20,
    color: '#6B7280',
    width: 24,
    textAlign: 'center',
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  infoValue: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  skillsSection: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  skillsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  skillBadgeText: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
  },
  noSkillsText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 4,
    minHeight: 72,
  },
  dangerousMenuItem: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  normalIconContainer: {
    backgroundColor: '#DBEAFE',
  },
  dangerousIconContainer: {
    backgroundColor: '#FEE2E2',
  },
  iconText: {
    fontSize: 18,
    textAlign: 'center',
  },
  menuItemText: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  dangerousText: {
    color: '#DC2626',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 18,
  },
  chevron: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  dangerousChevron: {
    color: '#F87171',
  },
});
